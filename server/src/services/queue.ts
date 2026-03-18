import { Queue, Worker, Job } from "bullmq";
import { Assignment } from "../models/Assignment";
import { isAIProviderError } from "./aiService";
import { generateAssessment } from "./aiProvider";
import { getIo } from "../socket";

const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

export const assignmentQueue = new Queue("assignment-generation", { connection });

export const initWorker = () => {
    const concurrency = Math.max(1, parseInt(process.env.ASSIGNMENT_QUEUE_CONCURRENCY || "1", 10));
    const limiterMax = parseInt(process.env.ASSIGNMENT_QUEUE_RATE_MAX || "0", 10);
    const limiterDuration = parseInt(process.env.ASSIGNMENT_QUEUE_RATE_DURATION_MS || "60000", 10);

    const worker = new Worker("assignment-generation", async (job: Job) => {
        const { assignmentId } = job.data;

        try {
            console.log(`[Job ${job.id}] Processing assignment ${assignmentId}`);
            const assignment = await Assignment.findById(assignmentId);
            if (!assignment) throw new Error("Assignment not found");

            // Update status to PROCESSING
            assignment.status = "PROCESSING";
            assignment.failureReason = undefined;
            await assignment.save();

            // Emit WS event
            getIo().to(assignmentId).emit("status_update", { assignmentId, status: "PROCESSING" });

            // Generate
            const generated = await generateAssessment(
                assignment.instructions || "",
                assignment.sourceMaterial || "",
                assignment.questionConfig
            );

            // Save COMPLETED
            assignment.status = "COMPLETED";
            assignment.generatedPaper = generated;
            await assignment.save();

            // Emit WS event
            getIo().to(assignmentId).emit("status_update", { assignmentId, status: "COMPLETED", data: generated });

            console.log(`[Job ${job.id}] Completed assignment ${assignmentId}`);

        } catch (error: any) {
            console.error(`[Job ${job.id}] Failed processing assignment ${assignmentId}:`, error);

            // If this is a retryable error and there are attempts left, avoid marking the assignment FAILED.
            const totalAttempts = job.opts.attempts ?? 1;
            const isLastAttempt = job.attemptsMade >= totalAttempts - 1;

            const isAIError = isAIProviderError(error);
            const isRetryableRateLimit = isAIError && error.code === "AI_PROVIDER_RATE_LIMIT" && !isLastAttempt;

            // If quota is effectively 0 / misconfigured, retries are pointless.
            const isFatalNoRetry =
                isAIError &&
                (error.code === "AI_PROVIDER_QUOTA_ZERO" || error.code === "AI_PROVIDER_MISCONFIGURED" || error.code === "AI_PROVIDER_BAD_OUTPUT");
            if (isFatalNoRetry && typeof (job as any).discard === "function") {
                (job as any).discard();
            }

            // If quota is zero, stop retrying and avoid spamming logs — persist failure and return.
            if (isAIError && error.code === "AI_PROVIDER_QUOTA_ZERO") {
                try {
                    const assignment = await Assignment.findById(assignmentId);
                    const retryAfterSeconds = error.retryAfterMs ? Math.ceil(error.retryAfterMs / 1000) : undefined;
                    const userMessage = `${error.message}${retryAfterSeconds ? ` (retry after ~${retryAfterSeconds}s)` : ""}`;
                    if (assignment) {
                        assignment.failureReason = userMessage;
                        assignment.status = "FAILED";
                        await assignment.save();
                        getIo().to(assignmentId).emit("status_update", {
                            assignmentId,
                            status: "FAILED",
                            error: userMessage,
                            code: error.code
                        });
                    }
                } catch (e) {
                    console.error(`Failed to persist STOP_RETRY state for assignment ${assignmentId}:`, e);
                }

                console.error(`[Job ${job.id}] STOP_RETRY: Gemini quota is 0 for model ${String(process.env.GEMINI_MODEL || "(default)")}`);
                return; // do not rethrow — stop further retries
            }

            const retryAfterSeconds = isAIError && error.retryAfterMs
                ? Math.ceil(error.retryAfterMs / 1000)
                : undefined;
            const userMessage = isAIError
                ? `${error.message}${retryAfterSeconds ? ` (retry after ~${retryAfterSeconds}s)` : ""}`
                : (error?.message || "Unknown error");

            const assignment = await Assignment.findById(assignmentId);
            if (assignment) {
                assignment.failureReason = userMessage;

                if (isRetryableRateLimit) {
                    assignment.status = "PENDING";
                    await assignment.save();
                    getIo().to(assignmentId).emit("status_update", {
                        assignmentId,
                        status: "PENDING",
                        error: userMessage,
                        code: isAIError ? error.code : undefined
                    });
                    throw error;
                }

                assignment.status = "FAILED";
                await assignment.save();
                getIo().to(assignmentId).emit("status_update", {
                    assignmentId,
                    status: "FAILED",
                    error: userMessage,
                    code: isAIError ? error.code : undefined
                });
            }

            // Always throw so BullMQ marks job as failed (and retries if configured).
            throw error;
        }
    }, {
        connection,
        concurrency,
        ...(Number.isFinite(limiterMax) && limiterMax > 0
            ? { limiter: { max: limiterMax, duration: limiterDuration } }
            : {})
    });

    worker.on("completed", (job) => console.log(`Job ${job.id} has completed!`));
    worker.on("failed", (job, err) => console.log(`Job ${job?.id} has failed with ${err.message}`));

    return worker;
};
