import { Request, Response } from "express";
import { TutorProfile, TutorCategory } from "../../../generated/prisma/client.ts";
import { tutorsService } from "./tutors.service.ts";

//* Register a Tutor
const registerTutor = async (req: Request, res: Response) => {
	try {
		// Insert to DB
		const tutor: Omit<TutorProfile, "updatedAt"> = await tutorsService.registerTutor(
			req.body,
		);
		// 201 success response
		res.status(201).json({
			success: true,
			message: "Tutor profile created successfully",
			data: tutor,
		});
	} catch (err: any) {
		// 500 error response
		res.status(500).json({
			success: false,
			message: "Unable to create tutor profile",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

//* Retrieve Tutors
const getTutors = async (req: Request, res: Response) => {
	try {
		// Receive request queries
		const query = req.query;
		const category = query.category as string | undefined;
		const search = query.search as string | undefined;
		const page = Number(query.page) as number | undefined;
		const limit = Number(query.limit) as number | undefined;
		// Organize queries
		const queries = {
			category,
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
		const result: { tutors: TutorProfile[]; total: number } =
			await tutorsService.getTutors(usedQueries);
		// 200 success response
		return res.status(200).json({
			success: true,
			message: "Tutors retrieved successfully",
			total: result.total,
			params: usedQueries,
			data: result.tutors,
		});
	} catch (err: any) {
		// 500 error response
		return res.status(500).json({
			success: false,
			message: "Unable to retrieve tutors",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

//* Retrieve a Tutor
const getTutor = async (req: Request, res: Response) => {
	try {
		// Receive request params
		const id = req.params.id as string;
		// Retrieve data
		const result: TutorProfile = await tutorsService.getTutor(id);
		// 200 success response
		return res.status(200).json({
			success: true,
			message: "Tutor retrieved successfully",
			data: result,
		});
	} catch (err: any) {
		// 500 error response
		return res.status(500).json({
			success: false,
			message: "Unable to retrieve the tutor",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

//* Add Category to Tutor
const addCategory = async (req: Request, res: Response) => {
	try {
		// Insert to DB
		const tutorCategory: TutorCategory = await tutorsService.addCategory(req.body);
		// 201 success response
		res.status(201).json({
			success: true,
			message: "Category added to Tutor successfully",
			data: tutorCategory,
		});
	} catch (err: any) {
		// 500 error response
		res.status(500).json({
			success: false,
			message: "Unable to add category to tutor",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

export const tutorsController = { registerTutor, getTutors, getTutor, addCategory };
