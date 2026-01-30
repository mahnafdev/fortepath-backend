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
					hourlyRate: {
						equals: Number(q.search),
					},
				},
				// Rating
				{
					reviews: {
						some: {
							review: {
								rating: {
									equals: Number(q.search),
								},
							},
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

export const tutorsService = { getTutors };
