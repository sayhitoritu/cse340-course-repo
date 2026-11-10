
import pool from "../database/index.js";

const getAllCategories = async () => {
    const sql = `
        SELECT *
        FROM categories
        ORDER BY category_id;
    `;

    const result = await pool.query(sql);
    return result.rows;
};

const getCategoryById = async (categoryId) => {
    const sql = `
        SELECT *
        FROM categories
        WHERE category_id = $1;
    `;

    const result = await pool.query(sql, [categoryId]);
    return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
    const sql = `
        SELECT
            categories.category_id,
            categories.name
        FROM categories
        JOIN project_categories
            ON categories.category_id = project_categories.category_id
        WHERE project_categories.project_id = $1
        ORDER BY categories.name;
    `;

    const result = await pool.query(sql, [projectId]);
    return result.rows;
};

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId
};
