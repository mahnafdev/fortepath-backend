import { Review } from "../../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

//* Create a Review
const createReview = async (data: Omit<Review, "id" | "createdAt">): Promise<Review> => {
	// Validate student's existence and role
	const student = await prisma.user.findUniqueOrThrow({
		where: {
			id: data.studentId as string,
			role: {
				in: ["student", "admin"],
			},
		},
	});
	// Validate tutor's existence and role
	const tutor = await prisma.tutorProfile.findUniqueOrThrow({
		where: {
			id: data.tutorId,
			user: {
				role: "tutor",
			},
		},
	});
	// Insertion
	const result = await prisma.review.create({
		data,
		include: {
			student: {
				select: {
					id: true,
					name: true,
				},
			},
			tutor: {
				select: {
					id: true,
					user: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
	});
	// Return
	return result;
};

//* Retrieve Reviews
const getReviews = async (q: {
	tutorId?: string;
	studentId?: string;
	rating?: number;
}): Promise<{ reviews: Review[]; total: number }> => {
	// Normalize queries
	const conditions: object[] = [];
	// Filter by tutor
	if (q.tutorId) {
		conditions.push({
			tutorId: q.tutorId,
		});
	}
	// Filter by student
	if (q.studentId) {
		conditions.push({
			studentId: q.studentId,
		});
	}
	// Filter by rating
	if (q.rating) {
		conditions.push({
			rating: q.rating,
		});
	}
	// Retrieval
	const reviews = await prisma.review.findMany({
		where: {
			AND: conditions,
		},
		include: {
			student: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
			tutor: {
				select: {
					id: true,
				},
			},
		},
	});
	// Return
	return { reviews, total: reviews.length };
};

export const reviewsService = { createReview, getReviews };
