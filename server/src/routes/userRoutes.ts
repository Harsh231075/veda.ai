import { Router } from "express";
import { getOrCreateUsers, getAllUsers } from "../controllers/userController";

const router = Router();

router.get("/setup", getOrCreateUsers);
router.get("/", getAllUsers);

export default router;
