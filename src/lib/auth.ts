import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.ts";
import { admin as adminCore } from "better-auth/plugins";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, student, tutor } from "./permissions.ts";

//* Better-Auth Initialization
const auth = betterAuth({
	// App and Basic Settings
	appName: "FortePath",
	basePath: "/api/v1/auth",
	trustedOrigins: [process.env.APP_URL!],
	// Database Settings
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	// Auth Settings
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		minPasswordLength: 6,
	},
	// OAuth Providers
	socialProviders: {
		google: {
			enabled: true,
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			accessType: "offline",
			prompt: "select_account consent",
			responseMode: "form_post",
			scope: ["openid", "email", "profile"],
		},
	},
	// Plugins
	plugins: [
		adminCore({
			ac,
			bannedUserMessage: "You are banned from FortePath",
			defaultRole: "student",
			roles: { admin, student, tutor },
		}),
		adminClient({
			ac,
			roles: { admin, student, tutor },
		}),
	],
});

export { auth };
