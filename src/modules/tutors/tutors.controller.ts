import { Request, Response } from "express";
import { TutorProfile } from "../../../generated/prisma/browser.ts";
import { tutorsService } from "./tutors.service.ts";

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

export const tutorsController = { getTutors, getTutor };
