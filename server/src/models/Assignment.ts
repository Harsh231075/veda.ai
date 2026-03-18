import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
    questionText: string;
    difficulty: "Easy" | "Moderate" | "Hard";
    marks: number;
    options?: string[];
    expectedAnswer?: string;
}

export interface ISection {
    title: string;
    instructions: string;
    questions: IQuestion[];
}

export interface IAssignment extends Document {
    createdBy: mongoose.Types.ObjectId;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    isPublished: boolean;
    dueDate?: Date;
    instructions?: string;
    sourceMaterial?: string;
    questionConfig: { type: string; count: number; marks: number }[];
    generatedPaper?: {
        sections: ISection[];
    };
    failureReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"], default: "PENDING" },
    isPublished: { type: Boolean, default: false },
    dueDate: { type: Date },
    instructions: { type: String },
    sourceMaterial: { type: String },
    questionConfig: [{
        type: { type: String },
        count: { type: Number },
        marks: { type: Number }
    }],
    failureReason: { type: String },
    generatedPaper: {
        sections: [{
            title: { type: String },
            instructions: { type: String },
            questions: [{
                questionText: { type: String },
                difficulty: { type: String, enum: ["Easy", "Moderate", "Hard"] },
                marks: { type: Number },
                options: [{ type: String }],
                expectedAnswer: { type: String }
            }]
        }]
    }
}, { timestamps: true });

export const Assignment = mongoose.model<IAssignment>("Assignment", AssignmentSchema);
