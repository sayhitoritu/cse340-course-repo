
import pool from "../database/index.js";

// Get all categories
const getAllCategories = async () => {
    const sql = `
        SELECT *
        FROM categories
        ORDER BY category_id;
    `;

    const result = await pool.query(sql);
    return result.rows;
};

// Get a category by ID
const getCategoryById = async (categoryId) => {
    const sql = `
        SELECT *
        FROM categories
        WHERE category_id = $1;
    `;

    const result = await pool.query(sql, [categoryId]);
    return result.rows[0];
};

// Create a new category
const createCategory = async (name) => {
    const sql = `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await pool.query(sql, [name]);

    if (result.rows.length === 0) {
        throw new Error("Failed to create category");
    }

    return result.rows[0].category_id;
};

// Update an existing category
const updateCategory = async (categoryId, name) => {
    const sql = `
        UPDATE categories
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await pool.query(sql, [name, categoryId]);

    if (result.rows.length === 0) {
        throw new Error("Category not found");
    }

    return result.rows[0].category_id;
};

// Get categories assigned to a project
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

// Assign a category to a project
const assignCategoryToProject = async (projectId, categoryId) => {
    const sql = `
        INSERT INTO project_categories (project_id, category_id)
        VALUES ($1, $2);
    `;

    await pool.query(sql, [projectId, categoryId]);
};

// Update category assignments for a project
const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteSql = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;

    await pool.query(deleteSql, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getCategoriesByProjectId,
    updateCategoryAssignments
};
