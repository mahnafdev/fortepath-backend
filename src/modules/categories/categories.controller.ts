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

//* Retrieve Categories
const getCategories = async (req: Request, res: Response) => {
	try {
		// Receive request queries
		const query = req.query;
		const search = query.search as string | undefined;
		const page = Number(query.page) as number | undefined;
		const limit = Number(query.limit) as number | undefined;
		// Organize queries
		const queries = {
			search,
			page,
			limit,
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
		const result: { categories: Category[]; total: number } =
			await categoriesService.getCategories(usedQueries);
		// 200 success response
		return res.status(200).json({
			success: true,
			message: "Categories retrieved successfully",
			total: result.total,
			params: usedQueries,
			data: result.categories,
		});
	} catch (err: any) {
		// 500 error response
		return res.status(500).json({
			success: false,
			message: "Unable to retrieve categories",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

//* Retrieve a Category
const getCategory = async (req: Request, res: Response) => {
	try {
		// Receive request params
		const id = req.params.id as string;
		// Retrieve data
		const result: Category = await categoriesService.getCategory(id);
		// 200 success response
		return res.status(200).json({
			success: true,
			message: "Category retrieved successfully",
			data: result,
		});
	} catch (err: any) {
		// 500 error response
		return res.status(500).json({
			success: false,
			message: "Unable to retrieve the category",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

//* Remove a Category
const deleteCategory = async (req: Request, res: Response) => {
	try {
		// Receive request params
		const id = req.params.id as string;
		// Remove category
		const result: Category = await categoriesService.deleteCategory(id);
		// 204 success response
		return res.status(204).json({
			success: true,
			message: "Category removed successfully",
			data: result,
		});
	} catch (err: any) {
		// 500 error response
		return res.status(500).json({
			success: false,
			message: "Unable to remove the category",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

export const categoriesController = {
	createCategory,
	getCategories,
	getCategory,
	deleteCategory,
};
