import { Router } from "express";
import { categoriesController } from "./categories.controller.ts";
import { auth, UserRole } from "../../middlewares/auth.ts";

const router = Router();

// POST /
router.post("/", auth(UserRole.TUTOR, UserRole.ADMIN), categoriesController.createCategory);

export { router as categoriesRouter };
