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

export const reviewsController = { createReview };
