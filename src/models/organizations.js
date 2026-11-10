
import pool from "../database/index.js";

const getAllOrganizations = async () => {
    const sql = `
        SELECT
            organization_id,
            name,
            description,
            image,
            contact_email
        FROM organizations
        ORDER BY organization_id;
    `;

    const result = await pool.query(sql);
    return result.rows;
};

const getOrganizationById = async (organizationId) => {
    const sql = `
        SELECT *
        FROM organizations
        WHERE organization_id = $1;
    `;

    const result = await pool.query(sql, [organizationId]);
    return result.rows[0];
};

export {
    getAllOrganizations,
    getOrganizationById
};


