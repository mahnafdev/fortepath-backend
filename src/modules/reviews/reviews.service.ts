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

export const reviewsService = { createReview };
