import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";


import dotenv from "dotenv"
dotenv.config();

const pool = new pg.Pool({
   connectionString: process.env["DATABASE_URL"],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsFolder = path.resolve(
   __dirname,
   "../../src/server/database/migrations"
);


(async () => {
   // this will automatically run needed migrations on the database
   await migrate(drizzle(pool), { migrationsFolder });
})();
