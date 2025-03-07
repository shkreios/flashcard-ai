import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined")
}

// Create a PostgreSQL connection
const client = postgres(process.env.DATABASE_URL)

// Create a Drizzle ORM instance
export const db = drizzle(client, { schema })

