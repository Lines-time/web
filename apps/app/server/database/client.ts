import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";

async function createClient() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error("Environment variable DATABASE_URL is not defined");
        process.exit(1);
    }

    const pgQuery = new Client({
        connectionString: databaseUrl,
    });
    await pgQuery.connect();
    const db = drizzle(pgQuery);

    await migrate(db, { migrationsFolder: "./migrations" });

    return db;
}

export default createClient;
