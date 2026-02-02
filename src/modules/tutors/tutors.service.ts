import { TutorProfile, TutorCategory } from "../../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

//* Register a Tutor
const registerTutor = async (
	data: Omit<TutorProfile, "id" | "createdAt" | "updatedAt">,
): Promise<Omit<TutorProfile, "updatedAt">> => {
	// Validate user's existence
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id: data.userId,
		},
	});
	// Validate user role
	if (user.role !== "tutor") {
		const err = new Error(
			`The provided value '${user.role}' for User field 'role' is not valid`,
		);
		// @ts-expect-error
		err.code = "P2006";
		throw err;
	}
	// Insertion
	const result = await prisma.tutorProfile.create({
		data,
		include: {
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
	});
	// Return
	return result;
};

//* Retrieve Tutors
const getTutors = async (q: {
	category?: string;
	search?: string;
	page?: number;
	limit?: number;
}): Promise<{ tutors: TutorProfile[]; total: number }> => {
	// Normalized queries
	const conditions: object[] = [];
	const presentation: {
		skip?: number;
		take?: number;
	} = {};
	// Filter by category
	if (q.category) {
		conditions.push({
			tutorCategories: {
				some: {
					category: {
						OR: [
							{
								name: {
									contains: q.category,
									mode: "insensitive",
								},
							},
							{
								slug: {
									contains: q.category,
									mode: "insensitive",
								},
							},
						],
					},
				},
			},
		});
	}
	// Search
	if (q.search) {
		conditions.push({
			OR: [
				// Name
				{
					user: {
						name: {
							contains: q.search,
							mode: "insensitive",
						},
					},
				},
				// Designation
				{
					designation: {
						contains: q.search,
						mode: "insensitive",
					},
				},
				// Category
				{
					tutorCategories: {
						some: {
							category: {
								name: {
									contains: q.search,
									mode: "insensitive",
								},
							},
						},
					},
				},
				// Hourly Rate
				{
					hourlyRate: Number(q.search) || undefined,
				},
				// Rating
				{
					reviews: {
						some: {
							rating: Number(q.search) || undefined,
						},
					},
				},
			],
		});
	}
	// Offset pagination
	if (q.page && q.limit) {
		presentation.skip = q.limit * (q.page - 1);
		presentation.take = q.limit;
	}
	// Retrieval
	const tutors = await prisma.tutorProfile.findMany({
		where: {
			AND: conditions,
		},
		skip: presentation.skip,
		take: presentation.take,
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			tutorCategories: {
				select: {
					category: {
						select: { id: true, name: true, slug: true, description: true },
					},
				},
			},
			reviews: {
				select: {
					rating: true,
				},
			},
		},
	});
	// Return
	return { tutors, total: tutors.length };
};

//* Retrieve a Tutor
const getTutor = async (id: string): Promise<TutorProfile> => {
	const result = await prisma.tutorProfile.findUniqueOrThrow({
		where: {
			id,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
				},
			},
			reviews: {
				select: {
					id: true,
					student: {
						select: {
							id: true,
							name: true,
						},
					},
					rating: true,
					feedback: true,
				},
			},
			bookings: {
				select: {
					id: true,
					student: {
						select: {
							id: true,
							name: true,
						},
					},
					topic: true,
					status: true,
				},
			},
			tutorCategories: {
				select: {
					category: {
						select: {
							id: true,
							name: true,
							slug: true,
							description: true,
						},
					},
				},
			},
		},
	});
	return result;
};

//* Add Category to Tutor
const addCategory = async (data: TutorCategory): Promise<TutorCategory> => {
	// Validate category's existence
	await prisma.category.findUniqueOrThrow({
		where: {
			id: data.categoryId,
		},
	});
	// Validate tutor's existence
	await prisma.tutorProfile.findUniqueOrThrow({
		where: {
			id: data.tutorId,
		},
	});
	// Insertion
	const result = await prisma.tutorCategory.create({
		data,
	});
	// Return
	return result;
};

export const tutorsService = { registerTutor, getTutors, getTutor, addCategory };
