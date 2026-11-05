
import pool from "../database/index.js";

async function getAllOrganizations() {
    const sql = "SELECT * FROM organizations ORDER BY organization_id";
    const result = await pool.query(sql);
    return result.rows;
}

export { getAllOrganizations };
