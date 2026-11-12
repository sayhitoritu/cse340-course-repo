
import {
    getAllOrganizations,
    getOrganizationById
} from "../models/organizations.js";

import { getProjectsByOrganizationId } from "../models/projects.js";

const buildOrganizations = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render("organizations", {
            title: "Organizations",
            organizations
        });
    } catch (error) {
        console.error("Error loading organizations:", error);
        next(error);
    }
};

const buildOrganizationById = async (req, res, next) => {
    try {
        const organizationId = Number(req.params.id);

        if (!Number.isInteger(organizationId) || organizationId <= 0) {
            const error = new Error("Organization not found");
            error.status = 404;
            return next(error);
        }

        const organization = await getOrganizationById(organizationId);

        if (!organization) {
            const error = new Error("Organization not found");
            error.status = 404;
            return next(error);
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        res.render("organization", {
            title: organization.name,
            organization,
            projects
        });
    } catch (error) {
        console.error("Error loading organization details:", error);
        next(error);
    }
};

export {
    buildOrganizations,
    buildOrganizationById
};

