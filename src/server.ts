import { app } from "./app.ts";
import { prisma } from "./lib/prisma.ts";

//* Port
const PORT = process.env.PORT || 8080;

async function main() {
	try {
		// Connect to DB
		await prisma.$connect();
		console.log("[SUCCESS] Connected to DB");
		// Listen to server
		app.listen(PORT, () => {
			console.log(`[SUCCESS] FortePath server is running on localhost:${PORT}`);
		});
	} catch (err) {
		// Log error
		console.error("[ERROR] A server error:", err);
		// Disconnect from DB
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();
