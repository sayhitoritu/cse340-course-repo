
import {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization
} from "../models/organizations.js";

import { getProjectsByOrganizationId } from "../models/projects.js";

import { body, validationResult } from "express-validator";

// Validation and sanitization rules for organization forms
const organizationValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Organization name is required")
        .isLength({ min: 3, max: 150 })
        .withMessage("Organization name must be between 3 and 150 characters")
        .escape(),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Organization description is required")
        .isLength({ max: 500 })
        .withMessage("Organization description cannot exceed 500 characters")
        .escape(),

    body("contactEmail")
        .trim()
        .notEmpty()
        .withMessage("Contact email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
];

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

// Display the new organization form
const showNewOrganizationForm = (req, res) => {
    res.render("new-organization", {
        title: "Create New Organization"
    });
};


// Display the edit organization form
const showEditOrganizationForm = async (req, res, next) => {
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

        res.render("edit-organization", {
            title: "Edit Organization",
            organization
        });
    } catch (error) {
        console.error("Error loading edit organization form:", error);
        next(error);
    }
};


// Process the submitted organization form

const processNewOrganizationForm = async (req, res, next) => {
    try {
        // Check for validation errors
        const results = validationResult(req);

        if (!results.isEmpty()) {
            // Display all validation errors using flash messages
            results.array().forEach((error) => {
                req.flash("error", error.msg);
            });

            // Return to the new organization form
            return res.redirect("/new-organization");
        }

        const { name, description, contactEmail } = req.body;

        const image = "placeholder-logo.png";

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            image
        );

        req.flash("success", "Organization added successfully!");

        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error("Error creating organization:", error);
        next(error);
    }
};


// Process the submitted edit organization form
const processEditOrganizationForm = async (req, res, next) => {
    try {
        console.log("EDIT CONTROLLER REACHED");
        const results = validationResult(req);
        console.log("VALIDATION ERRORS:", results.array());

        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash("error", error.msg);
            });

            return res.redirect(`/edit-organization/${req.params.id}`);
        }

        const organizationId = Number(req.params.id);

        if (!Number.isInteger(organizationId) || organizationId <= 0) {
            const error = new Error("Organization not found");
            error.status = 404;
            return next(error);
        }

        const { name, description, contactEmail, image } = req.body;

        console.log("UPDATING ORGANIZATION:", organizationId);
        await updateOrganization(
            organizationId,
            name,
            description,
            contactEmail,
            image
        );

        req.flash("success", "Organization updated successfully!");

        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error("Error updating organization:", error);
        next(error);
    }
};



export {
    buildOrganizations,
    buildOrganizationById,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};

