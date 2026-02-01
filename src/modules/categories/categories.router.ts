import { Router } from "express";
import { categoriesController } from "./categories.controller.ts";
import { auth, UserRole } from "../../middlewares/auth.ts";

const router = Router();

// POST /
router.post("/", auth(UserRole.TUTOR, UserRole.ADMIN), categoriesController.createCategory);
// GET /
router.get(
	"/",
	auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
	categoriesController.getCategories,
);
// DELETE /:id
router.delete("/:id", auth(UserRole.ADMIN), categoriesController.deleteCategory);

export { router as categoriesRouter };
