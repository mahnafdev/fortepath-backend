import { Router } from "express";
import { categoriesController } from "./categories.controller.ts";
import { auth, UserRole } from "../../middlewares/auth.ts";

const router = Router();

// POST /
router.post("/", auth(UserRole.TUTOR, UserRole.ADMIN), categoriesController.createCategory);
// GET /
router.get("/", auth(UserRole.TUTOR, UserRole.ADMIN), categoriesController.getCategories);

export { router as categoriesRouter };
