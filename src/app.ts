import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";

//* Express App
const app: Application = express();

//* Global Middlewares
app.use(express.json());
app.use(
	cors({
		origin: process.env.APP_URL || "http://localhost:3000",
		credentials: true,
	}),
);

//* GET /
app.get("/", (_req, res) => {
	//* 200 Success Response
	res.status(200).json({
		success: true,
		message: "Greetings to you, from FortePath",
	});
});

export { app };
