import { Request, Response } from "express";
import { Submission } from "../models/Submission";
import { Assignment } from "../models/Assignment";

export const submitAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const assignmentId = req.params.assignmentId as string;
        const { studentId, answers } = req.body;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
             res.status(404).json({ error: "Assignment not found" });
             return;
        }

        const submission = await Submission.create({
            assignmentId,
            studentId,
            answers
        });

        res.status(201).json({ message: "Assignment submitted successfully", submission });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getStudentSubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params;
        const submissions = await Submission.find({ studentId }).populate("assignmentId");
        res.json(submissions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getAssignmentSubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assignmentId } = req.params;
        const submissions = await Submission.find({ assignmentId }).populate("studentId", "name email");
        res.json(submissions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
