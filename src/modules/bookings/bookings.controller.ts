import { Request, Response } from "express";
import { Booking, BookingStatus } from "../../../generated/prisma/client.ts";
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

//* Retrieve Bookings
const getBookings = async (req: Request, res: Response) => {
	try {
		// Receive request queries
		const query = req.query;
		const tutorId = query.tutorId as string | undefined;
		const studentId = query.studentId as string | undefined;
		const status = query.status as BookingStatus | undefined;
		const page = Number(query.page) as number | undefined;
		const limit = Number(query.limit) as number | undefined;
		// Organize queries
		const queries = {
			tutorId,
			studentId,
			status,
			page,
			limit,
		};
		// Extract used queries
		const usedQueries = Object.fromEntries(
			Object.entries(queries).filter(([_, value]) => {
				if (!value) return false;
				if (Array.isArray(value) && value.length === 0) return false;
				return true;
			}),
		);
		// Core task
		const result: { bookings: Booking[]; total: number } =
			await bookingsService.getBookings(usedQueries);
		// 200 success response
		return res.status(200).json({
			success: true,
			message: "Bookings retrieved successfully",
			total: result.total,
			params: usedQueries,
			data: result.bookings,
		});
	} catch (err: any) {
		// 500 error response
		return res.status(500).json({
			success: false,
			message: "Unable to retrieve bookings",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

export const bookingsController = { createBooking, getBookings };
