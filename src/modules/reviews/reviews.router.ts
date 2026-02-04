import { Router } from "express";
import { reviewsController } from "./reviews.controller.ts";
import { auth, UserRole } from "../../middlewares/auth.ts";

const router = Router();

// POST /
router.post("/", auth(UserRole.STUDENT, UserRole.ADMIN), reviewsController.createReview);
// GET /
router.get(
	"/",
	auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
	reviewsController.getReviews,
);

export { router as reviewsRouter };
