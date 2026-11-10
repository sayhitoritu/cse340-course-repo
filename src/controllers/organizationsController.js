
import {
    getAllOrganizations,
    getOrganizationById
} from "../models/organizations.js";

import { getProjectsByOrganizationId } from "../models/projects.js";

const buildOrganizations = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();

        res.render("organizations", {
            title: "Organizations",
            organizations
        });
    } catch (error) {
        console.error("Error loading organizations:", error);
        res.status(500).send("Unable to load organizations");
    }
};

const buildOrganizationById = async (req, res) => {
    try {
        const organizationId = Number(req.params.id);

        if (!Number.isInteger(organizationId) || organizationId <= 0) {
            return res.status(404).send("Organization not found");
        }

        const organization = await getOrganizationById(organizationId);

        if (!organization) {
            return res.status(404).send("Organization not found");
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        res.render("organization", {
            title: organization.name,
            organization,
            projects
        });
    } catch (error) {
        console.error("Error loading organization details:", error);
        res.status(500).send("Unable to load organization details");
    }
};

export {
    buildOrganizations,
    buildOrganizationById
};
