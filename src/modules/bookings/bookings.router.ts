import { Router } from "express";
import { bookingsController } from "./bookings.controller.ts";
import { auth, UserRole } from "../../middlewares/auth.ts";

const router = Router();

// POST /
router.post("/", auth(UserRole.STUDENT, UserRole.ADMIN), bookingsController.createBooking);
// GET /
router.get(
	"/",
	auth(UserRole.STUDENT),
	auth(UserRole.TUTOR),
	auth(UserRole.ADMIN),
	bookingsController.getBookings,
);

export { router as bookingsRouter };
