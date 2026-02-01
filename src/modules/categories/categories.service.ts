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

export const categoriesService = { createCategory };
