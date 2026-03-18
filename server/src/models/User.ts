import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    role: "teacher" | "student";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["teacher", "student"], required: true }
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", UserSchema);
