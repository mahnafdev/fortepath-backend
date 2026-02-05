import { Booking, BookingStatus } from "../../../generated/prisma/client.ts";
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

//* Retrieve Bookings
const getBookings = async (q: {
	tutorId?: string;
	studentId?: string;
	status?: BookingStatus;
	page?: number;
	limit?: number;
}): Promise<{ bookings: Booking[]; total: number }> => {
	// Normalize queries
	const conditions: object[] = [];
	const presentation: {
		skip?: number;
		take?: number;
	} = {};
	// Filter by tutor
	if (q.tutorId) {
		conditions.push({
			tutorId: q.tutorId,
		});
	}
	// Filter by student
	if (q.studentId) {
		conditions.push({
			studentId: q.studentId,
		});
	}
	// Filter by status
	if (q.status) {
		conditions.push({
			status: q.status,
		});
	}
	// Offset pagination
	if (q.page && q.limit) {
		presentation.skip = q.limit * (q.page - 1);
		presentation.take = q.limit;
	}
	// Retrieval
	const bookings = await prisma.booking.findMany({
		where: {
			AND: conditions,
		},
		skip: presentation.skip,
		take: presentation.take,
		include: {
			tutor: {
				select: {
					id: true,
					user: {
						select: {
							name: true,
							image: true,
						},
					},
				},
			},
			student: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
	});
	// Return
	return { bookings, total: bookings.length };
};

export const bookingsService = { createBooking, getBookings };
