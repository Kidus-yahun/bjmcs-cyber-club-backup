/**
 * Prisma client singleton.
 *
 * In development, Next.js hot-reloads modules which would create
 * multiple Prisma Client instances. We store the instance on `globalThis`
 * to prevent connection exhaustion.
 *
 * This module must only be imported on the server side.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
