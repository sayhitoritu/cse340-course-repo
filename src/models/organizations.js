
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

const createOrganization = async (name, description, contactEmail, image) => {
    const sql = `
        INSERT INTO organizations (name, description, image, contact_email)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `;

    const result = await pool.query(sql, [
        name,
        description,
        image,
        contactEmail
    ]);

    return result.rows[0].organization_id;
};


const updateOrganization = async (
    organizationId,
    name,
    description,
    contactEmail,
    image
) => {
    const sql = `
        UPDATE organizations
        SET
            name = $1,
            description = $2,
            contact_email = $3,
            image = $4
        WHERE organization_id = $5
        RETURNING organization_id;
    `;

    const result = await pool.query(sql, [
        name,
        description,
        contactEmail,
        image,
        organizationId
    ]);

    if (result.rows.length === 0) {
        throw new Error("Organization not found");
    }

    return result.rows[0].organization_id;
};


export {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization
};


