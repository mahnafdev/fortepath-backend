import { Category } from "../../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

//* Create a Category
const createCategory = async (
	data: Omit<Category, "id" | "createdAt" | "updatedAt">,
): Promise<Omit<Category, "updatedAt">> => {
	const result = await prisma.category.create({
		data,
		omit: {
			updatedAt: true,
		},
	});
	return result;
};

//* Retrieve Categories
const getCategories = async (q: {
	search?: string;
}): Promise<{ categories: Category[]; total: number }> => {
	// Normalized queries
	const conditions: object[] = [];
	// Search
	if (q.search) {
		conditions.push({
			OR: [
				// Name
				{
					name: {
						contains: q.search,
						mode: "insensitive",
					},
				},
				// Slug
				{
					slug: {
						contains: q.search,
						mode: "insensitive",
					},
				},
				// Description
				{
					description: {
						contains: q.search,
						mode: "insensitive",
					},
				},
			],
		});
	}
	// Retrieval
	const categories = await prisma.category.findMany({
		where: {
			AND: conditions,
		},
	});
	// Return
	return { categories, total: categories.length };
};

//* Remove a Category
const deleteCategory = async (id: string): Promise<Category> => {
	const result = await prisma.category.delete({
		where: {
			id,
		},
		include: {
			tutorCategories: {
				select: {
					tutor: {
						select: {
							id: true,
							user: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			},
		},
	});
	return result;
};

export const categoriesService = { createCategory, getCategories, deleteCategory };
