import { Request, Response } from "express";
import { Booking } from "../../../generated/prisma/client.ts";
import { bookingsService } from "./bookings.service.ts";

//* Create a Booking
const createBooking = async (req: Request, res: Response) => {
	try {
		// Core task
		const booking: Omit<Booking, "updatedAt"> = await bookingsService.createBooking(
			req.body,
		);
		// 201 success response
		res.status(201).json({
			success: true,
			message: "Booking created successfully",
			data: booking,
		});
	} catch (err: any) {
		// 500 error response
		res.status(500).json({
			success: false,
			message: "Unable to create booking",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

export const bookingsController = { createBooking };
