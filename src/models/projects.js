
import pool from "../database/index.js";

const getAllProjects = async () => {
    const sql = `
        SELECT
            projects.project_id,
            projects.name,
            projects.description,
            projects.location,
            projects.project_date,
            organizations.name AS organization_name,
            STRING_AGG(categories.name, ', ') AS category_names
        FROM projects
        LEFT JOIN organizations
            ON projects.organization_id = organizations.organization_id
        LEFT JOIN project_categories
            ON projects.project_id = project_categories.project_id
        LEFT JOIN categories
            ON project_categories.category_id = categories.category_id
        WHERE projects.project_date >= CURRENT_DATE
        GROUP BY
            projects.project_id,
            projects.name,
            projects.description,
            projects.location,
            projects.project_date,
            organizations.name
        ORDER BY projects.project_date
        LIMIT 5;
    `;

    const result = await pool.query(sql);
    return result.rows;
};

const getProjectById = async (projectId) => {
    const sql = `
        SELECT
            projects.*,
            organizations.name AS organization_name,
            organizations.organization_id
        FROM projects
        JOIN organizations
            ON projects.organization_id = organizations.organization_id
        WHERE projects.project_id = $1;
    `;

    const result = await pool.query(sql, [projectId]);
    return result.rows[0];
};

const getProjectsByCategoryId = async (categoryId) => {
    const sql = `
        SELECT
            projects.project_id,
            projects.name,
            projects.description,
            projects.location,
            projects.project_date
        FROM projects
        JOIN project_categories
            ON projects.project_id = project_categories.project_id
        WHERE project_categories.category_id = $1
        ORDER BY projects.project_date;
    `;

    const result = await pool.query(sql, [categoryId]);
    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const sql = `
        SELECT
            project_id,
            name,
            description,
            location,
            project_date
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const result = await pool.query(sql, [organizationId]);
    return result.rows;
};

export {
    getAllProjects,
    getProjectById,
    getProjectsByCategoryId,
    getProjectsByOrganizationId
};

