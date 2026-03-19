import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import cors from "cors";
import { connectDB } from "./db/connect";
import { initSocket } from "./socket";
import { initWorker } from "./services/queue";
import assignmentRoutes from "./routes/assignmentRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const server = createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Init DB
connectDB();

// Init WebSocket
initSocket(server);

// Init Worker
initWorker();

// Routes
app.use("/api/assignments", assignmentRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
