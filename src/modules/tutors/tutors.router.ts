import { Router } from "express";
import { tutorsController } from "./tutors.controller.ts";
import { auth, UserRole } from "../../middlewares/auth.ts";

const router = Router();

// POST /
router.post("/", tutorsController.registerTutor);
// GET /
router.get(
	"/",
	auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
	tutorsController.getTutors,
);
// GET /:id
router.get(
	"/:id",
	auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
	tutorsController.getTutor,
);

// POST /categories
router.post("/categories", auth(UserRole.TUTOR, UserRole.ADMIN), tutorsController.addCategory);

export { router as tutorsRouter };
