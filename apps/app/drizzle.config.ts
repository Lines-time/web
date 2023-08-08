import type { Config } from "drizzle-kit";

export default {
    schema: "./server/database/schema",
    out: "./server/database/migrations",
    driver: "pg",
    dbCredentials: {
        connectionString: "postgres://postgres:postgres@localhost:5432/lines_time",
    },
} satisfies Config;
