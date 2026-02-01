import { TutorProfile } from "../../../generated/prisma/browser.ts";
import { prisma } from "../../lib/prisma.ts";

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
						select: { name: true, slug: true },
					},
				},
			},
			reviews: {
				select: {
					student: {
						select: {
							name: true,
						},
					},
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
							name: true,
							slug: true,
						},
					},
				},
			},
		},
	});
	return result;
};

export const tutorsService = { getTutors, getTutor };
