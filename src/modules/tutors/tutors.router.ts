import { Router } from "express";
import { tutorsController } from "./tutors.controller.ts";
import { auth, UserRole } from "../../middlewares/auth.ts";

const router = Router();

// GET /
router.get(
	"/",
	auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
	tutorsController.getTutors,
);

export { router as tutorsRouter };
