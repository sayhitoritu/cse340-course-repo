import pool from "../database/index.js";

async function getAllProjects() {
    const sql = `
        SELECT
            projects.project_id,
            projects.name,
            projects.description,
            organizations.name AS organization_name,
            STRING_AGG(categories.name, ', ') AS category_names
        FROM projects
        LEFT JOIN organizations
            ON projects.organization_id = organizations.organization_id
        LEFT JOIN project_categories
            ON projects.project_id = project_categories.project_id
        LEFT JOIN categories
            ON project_categories.category_id = categories.category_id
        GROUP BY
            projects.project_id,
            projects.name,
            projects.description,
            organizations.name
        ORDER BY projects.project_id;
    `;

    const result = await pool.query(sql);

    console.log("Projects retrieved:", result.rows);

    return result.rows;
}

export { getAllProjects };