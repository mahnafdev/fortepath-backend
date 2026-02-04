import { Router } from "express";
import { reviewsController } from "./reviews.controller.ts";
import { auth, UserRole } from "../../middlewares/auth.ts";

const router = Router();

// POST /
router.post("/", auth(UserRole.STUDENT, UserRole.ADMIN), reviewsController.createReview);

export { router as reviewsRouter };
