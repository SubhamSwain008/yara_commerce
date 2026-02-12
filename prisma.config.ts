import "dotenv/config";
import { defineConfig } from "prisma/config";

const isMigrate =
  process.argv.includes("migrate") ||
  process.argv.includes("db") ||
  process.argv.includes("introspect");

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: isMigrate
      ? process.env.DIRECT_URL   // migrations bypass RLS
      : process.env.DATABASE_URL // app uses pooler
  },

  migrations: {
    path: "prisma/migrations",
  },
});
