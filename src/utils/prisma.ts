import { PrismaClient } from "@prisma/client";

export const prisma = global.prisma || new PrismaClient();

declare global {
  var prisma: PrismaClient | undefined;
}
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
