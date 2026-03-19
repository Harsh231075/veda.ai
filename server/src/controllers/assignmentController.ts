import { Request, Response } from "express";
import { Assignment } from "../models/Assignment";
import { assignmentQueue } from "../services/queue";

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dueDate, instructions, questionsConfig, sourceText, createdBy } = req.body;

        let config = questionsConfig;
        if (config && typeof config === "string") {
            try { config = JSON.parse(config); } catch (e) { }
        }

        if (!config || !Array.isArray(config)) {
            res.status(400).json({ error: "questionsConfig array is required" });
            return;
        }

        if (!createdBy) {
            res.status(400).json({ error: "createdBy (Teacher ID) is required" });
            return;
        }

        let extractedText = sourceText || "";
        if (req.file) {
            if (req.file.mimetype === "application/pdf") {
                const { PDFParse } = require("pdf-parse");
                const parser = new PDFParse({ data: req.file.buffer });
                const pdfData = await parser.getText();
                extractedText = pdfData.text;
                await parser.destroy();
            } else if (req.file.mimetype === "text/plain") {
                extractedText = req.file.buffer.toString("utf8");
            }
        }

        const newAssignment = new Assignment({
            createdBy,
            status: "PENDING",
            dueDate: dueDate || null,
            instructions: instructions || "",
            sourceMaterial: extractedText,
            questionConfig: config
        });

        await newAssignment.save();

        // Add to queue
        const attempts = Math.max(1, parseInt(process.env.ASSIGNMENT_JOB_ATTEMPTS || "3", 10));
        const backoffMs = Math.max(1000, parseInt(process.env.ASSIGNMENT_JOB_BACKOFF_MS || "45000", 10));
        await assignmentQueue.add(
            "generate",
            { assignmentId: newAssignment._id },
            {
                jobId: String(newAssignment._id),
                attempts,
                backoff: { type: "fixed", delay: backoffMs },
                removeOnComplete: true,
                removeOnFail: false
            }
        );

        res.status(201).json({
            message: "Assignment created and queued",
            assignmentId: newAssignment._id
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate("createdBy", "name email");
        if (!assignment) {
            res.status(404).json({ error: "Assignment not found" });
            return;
        }
        res.status(200).json(assignment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAssignmentsByTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
        const assignments = await Assignment.find({ createdBy: req.params.teacherId }).sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
        const assignments = await Assignment.find({ status: "COMPLETED", isPublished: true })
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const publishAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            res.status(404).json({ error: "Assignment not found" });
            return;
        }

        assignment.isPublished = true;
        await assignment.save();

        res.json({ message: "Assignment published successfully!", assignment });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) {
            res.status(404).json({ error: "Assignment not found" });
            return;
        }
        res.json({ message: "Assignment deleted successfully!" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
