import { Request, Response } from "express";
import { User } from "../models/User";

export const getOrCreateUsers = async (req: Request, res: Response) => {
    try {
        // Find existing mock users or create them
        let teacher = await User.findOne({ role: "teacher" });
        if (!teacher) {
            teacher = await User.create({ name: "Mr. Sharma", email: "teacher@veda.ai", role: "teacher" });
        }

        let student = await User.findOne({ role: "student" });
        if (!student) {
            student = await User.create({ name: "Raju", email: "student@veda.ai", role: "student" });
        }

        res.json({ teacher, student });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
