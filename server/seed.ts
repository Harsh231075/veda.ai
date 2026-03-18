import mongoose from "mongoose";
import { User } from "./src/models/User";
import dotenv from "dotenv";

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/veda");
        console.log("Connected to MongoDB");

        await User.deleteMany({}); // clear existing
        console.log("Cleared existing users");

        const teacher = await User.create({
            name: "Rakesh Sharma",
            email: "rakesh@veda.ai",
            role: "teacher"
        });
        console.log("Created Teacher:", teacher.name);

        const students = [
            { name: "Aarav Gupta", email: "aarav@veda.ai", role: "student" },
            { name: "Vihaan Singh", email: "vihaan@veda.ai", role: "student" },
            { name: "Aditya Patel", email: "aditya@veda.ai", role: "student" },
            { name: "Sai Krishna", email: "sai@veda.ai", role: "student" },
            { name: "Ananya Reddy", email: "ananya@veda.ai", role: "student" },
            { name: "Diya Verma", email: "diya@veda.ai", role: "student" },
            { name: "Kavya Iyer", email: "kavya@veda.ai", role: "student" },
            { name: "Ishaan Joshi", email: "ishaan@veda.ai", role: "student" },
            { name: "Riya Desai", email: "riya@veda.ai", role: "student" },
            { name: "Arjun Nair", email: "arjun@veda.ai", role: "student" }
        ];

        await User.insertMany(students);
        console.log(`Created ${students.length} Students`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
