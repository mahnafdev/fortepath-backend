import { Request, Response } from "express";
import { Category } from "../../../generated/prisma/client.ts";
import { categoriesService } from "./categories.service.ts";

//* Create a Category
const createCategory = async (req: Request, res: Response) => {
	try {
		// Insert to DB
		const category: Omit<Category, "updatedAt"> = await categoriesService.createCategory(
			req.body,
		);
		// 201 success response
		res.status(201).json({
			success: true,
			message: "Category created successfully",
			data: category,
		});
	} catch (err: any) {
		// 500 error response
		res.status(500).json({
			success: false,
			message: "Unable to create category",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

export const categoriesController = { createCategory };
