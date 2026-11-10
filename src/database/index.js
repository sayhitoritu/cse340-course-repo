import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
});

pool.query(`
    SELECT
        current_database(),
        current_schema(),
        current_setting('search_path')
`)
    .then(result => {
        console.log("Application database:", result.rows[0]);
    })
    .catch(error => console.error("Database check:", error));

export default pool;
pool.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND (
        (table_name = 'organizations'
         AND column_name = 'contact_email')
        OR
        (table_name = 'projects'
         AND column_name IN ('location', 'project_date'))
    )
    ORDER BY table_name, column_name;
`)
    .then(result => {
        console.log("Application sees required columns:", result.rows);
    })
    .catch(error => {
        console.error("Column verification failed:", error);
    });