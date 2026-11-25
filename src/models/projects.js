

import pool from "../database/index.js";

const getAllProjects = async () => {
    const sql = `
        SELECT
            projects.project_id,
            projects.organization_id,
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
        GROUP BY
            projects.project_id,
            projects.organization_id,
            projects.name,
            projects.description,
            projects.location,
            projects.project_date,
            organizations.name
        ORDER BY projects.project_date;
    `;

    const result = await pool.query(sql);
    return result.rows;
};


const getProjectById = async (projectId) => {
    const sql = `
        SELECT
            projects.*,
            TO_CHAR(projects.project_date, 'YYYY-MM-DD') AS formatted_project_date,
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


const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {
    const sql = `
        INSERT INTO projects (
            name,
            description,
            location,
            project_date,
            organization_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const result = await pool.query(sql, [
        title,
        description,
        location,
        date,
        organizationId
    ]);

    if (result.rows.length === 0) {
        throw new Error("Failed to create project");
    }

    return result.rows[0].project_id;
};


const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {
    const sql = `
        UPDATE projects
        SET
            name = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const result = await pool.query(sql, [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ]);

    if (result.rows.length === 0) {
        throw new Error("Project not found");
    }

    return result.rows[0].project_id;
};



export {
    getAllProjects,
    getProjectById,
    getProjectsByCategoryId,
    getProjectsByOrganizationId,
    createProject,
    updateProject
};
