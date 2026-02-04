import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import { auth } from "./lib/auth.ts";
import { tutorsRouter } from "./modules/tutors/tutors.router.ts";
import { categoriesRouter } from "./modules/categories/categories.router.ts";
import { reviewsRouter } from "./modules/reviews/reviews.router.ts";

//* Express App
const app: Application = express();

//* Auth Route Handler
app.all("/api/v1/auth/*splat", toNodeHandler(auth));

//* Global Middlewares
app.use(express.json());
app.use(
	cors({
		origin: process.env.APP_URL || "http://localhost:3000",
		credentials: true,
	}),
);

//* Modules
app.use(`${process.env.API_BASE}/tutors`, tutorsRouter);
app.use(`${process.env.API_BASE}/categories`, categoriesRouter);
app.use(`${process.env.API_BASE}/reviews`, reviewsRouter);

//* GET /
app.get("/", (_req, res) => {
	//* 200 Success Response
	res.status(200).json({
		success: true,
		message: "Greetings to you, from FortePath",
	});
});

export { app };
