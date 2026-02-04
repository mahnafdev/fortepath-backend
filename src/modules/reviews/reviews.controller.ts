import { Request, Response } from "express";
import { Review } from "../../../generated/prisma/client.ts";
import { reviewsService } from "./reviews.service.ts";

//* Create a Review
const createReview = async (req: Request, res: Response) => {
	try {
		const review: Review = await reviewsService.createReview(req.body);
		// 201 success response
		res.status(201).json({
			success: true,
			message: "Review created successfully",
			data: review,
		});
	} catch (err: any) {
		// 500 error response
		res.status(500).json({
			success: false,
			message: "Unable to create review",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

//* Retrieve Reviews
const getReviews = async (req: Request, res: Response) => {
	try {
		// Receive request queries
		const query = req.query;
		const tutorId = query.tutorId as string | undefined;
		const studentId = query.studentId as string | undefined;
		const rating = Number(query.rating) as number | undefined;
		// Organize queries
		const queries = {
			tutorId,
			studentId,
			rating,
		};
		// Extract used queries
		const usedQueries = Object.fromEntries(
			Object.entries(queries).filter(([_, value]) => {
				if (!value) return false;
				if (Array.isArray(value) && value.length === 0) return false;
				return true;
			}),
		);
		// Retrieve data
		const result: { reviews: Review[]; total: number } =
			await reviewsService.getReviews(usedQueries);
		// 200 success response
		return res.status(200).json({
			success: true,
			message: "Reviews retrieved successfully",
			total: result.total,
			params: usedQueries,
			data: result.reviews,
		});
	} catch (err: any) {
		// 500 error response
		return res.status(500).json({
			success: false,
			message: "Unable to retrieve reviews",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

export const reviewsController = { createReview, getReviews };
