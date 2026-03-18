import { Router } from "express";
import { submitAssignment, getStudentSubmissions, getAssignmentSubmissions } from "../controllers/submissionController";

const router = Router();

router.post("/:assignmentId", submitAssignment);
router.get("/student/:studentId", getStudentSubmissions);
router.get("/assignment/:assignmentId", getAssignmentSubmissions);

export default router;
