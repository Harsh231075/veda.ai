import { Router } from "express";
import { createAssignment, getAssignment, getAssignmentsByTeacher, getAllAssignments, publishAssignment, deleteAssignment } from "../controllers/assignmentController";
import { upload } from "../middlewares/upload";

const router = Router();

router.post("/", upload.single("file"), createAssignment);
router.put("/:id/publish", publishAssignment);
router.get("/", getAllAssignments);
router.get("/teacher/:teacherId", getAssignmentsByTeacher);
router.get("/:id", getAssignment);
router.delete("/:id", deleteAssignment);

export default router;
