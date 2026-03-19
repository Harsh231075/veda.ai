import { Request, Response } from "express";
import { User } from "../models/User";

export const getOrCreateUsers = async (req: Request, res: Response) => {
    try {
        // Ensure at least one mock teacher user exists
        let teacher = await User.findOne({ role: "teacher" });
        if (!teacher) {
            teacher = await User.create({ name: "Mr. Sharma", email: "teacher@veda.ai", role: "teacher" });
        }

        res.json({ teacher });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // For this demo, only expose teacher accounts to the client
        const teachers = await User.find({ role: "teacher" });
        res.json(teachers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
