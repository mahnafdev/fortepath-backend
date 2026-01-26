import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

//* DB Connection String
const connectionString = process.env.DB_URL;

//* Postgres Adapter
const adapter = new PrismaPg({ connectionString });

//* Prisma Client
const prisma = new PrismaClient({ adapter });

export { prisma };
