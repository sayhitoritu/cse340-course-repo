import pool from "../database/index.js";

async function getAllCategories() {
    const sql = "SELECT * FROM categories ORDER BY category_id";
    const result = await pool.query(sql);
    return result.rows;
}

export { getAllCategories };