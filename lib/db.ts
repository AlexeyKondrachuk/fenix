import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const state = globalThis as typeof globalThis & {
  fenixPrisma?: PrismaClient;
  fenixPrismaConstructor?: typeof PrismaClient;
};

export function db() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required");
  // Regenerating Prisma changes the constructor; discard the instance of the old schema after HMR.
  if (!state.fenixPrisma || state.fenixPrismaConstructor !== PrismaClient) {
    const previous = state.fenixPrisma;
    state.fenixPrisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
    state.fenixPrismaConstructor = PrismaClient;
    if (previous) void previous.$disconnect().catch(() => {});
  }
  return state.fenixPrisma;
}
