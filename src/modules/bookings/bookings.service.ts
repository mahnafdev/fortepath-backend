import { Booking } from "../../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

//* Create a Booking
const createBooking = async (
	data: Omit<Booking, "id" | "createdAt" | "updatedAt" | "status">,
): Promise<Omit<Booking, "updatedAt">> => {
	// Validate tutor's existence
	const tutor = await prisma.tutorProfile.findUniqueOrThrow({
		where: {
			id: data.tutorId as string,
			user: {
				role: "tutor",
			},
		},
	});
	// Validate student's existence
	const student = await prisma.user.findUniqueOrThrow({
		where: {
			id: data.studentId as string,
			role: "student",
		},
	});
	// Insertion
	const result = await prisma.booking.create({
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

export const bookingsService = { createBooking };
