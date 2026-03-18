import mongoose, { Document, Schema } from "mongoose";

export interface ISubmission extends Document {
    assignmentId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    answers: {
        questionText: string;
        studentAnswer: string;
        marksObtained?: number;
    }[];
    totalScore?: number;
    graded: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{
        questionText: { type: String, required: true },
        studentAnswer: { type: String, required: true },
        marksObtained: { type: Number, default: null }
    }],
    totalScore: { type: Number, default: null },
    graded: { type: Boolean, default: false }
}, { timestamps: true });

export const Submission = mongoose.model<ISubmission>("Submission", SubmissionSchema);
