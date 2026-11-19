
import { body, validationResult } from "express-validator";
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject
} from "../models/projects.js";

import { getCategoriesByProjectId } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";


const projectValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3, max: 200 })
        .withMessage("Title must be between 3 and 200 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 999 })
        .withMessage("Description must be less than 1000 characters"),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required")
        .isLength({ max: 199 })
        .withMessage("Location must be less than 200 characters"),

    body("date")
        .notEmpty()
        .withMessage("Date is required")
        .isISO8601()
        .withMessage("Date must be a valid date format"),

    body("organizationId")
        .notEmpty()
        .withMessage("Organization is required")
        .isInt({ min: 1 })
        .withMessage("Organization must be a valid integer")
];


const buildProjects = async (req, res, next) => {
    try {
        const projects = await getAllProjects();

        res.render("projects", {
            title: "Service Projects",
            projects
        });
    } catch (error) {
        console.error("Error loading projects:", error);
        next(error);
    }
};

const buildProjectById = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            const error = new Error("Project not found");
            error.status = 404;
            return next(error);
        }

        const project = await getProjectById(projectId);

        if (!project) {
            const error = new Error("Project not found");
            error.status = 404;
            return next(error);
        }

        const categories = await getCategoriesByProjectId(projectId);

        res.render("project", {
            title: project.name,
            project,
            categories
        });
    } catch (error) {
        console.error("Error loading project details:", error);
        next(error);
    }
};


const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render("new-project", {
            title: "Add New Service Project",
            organizations
        });
    } catch (error) {
        console.error("Error loading new project form:", error);
        next(error);
    }
};


// Display the edit service project form
const showEditProjectForm = async (req, res, next) => {
    console.log("EDIT PROJECT CONTROLLER REACHED:", req.params.id);
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            const error = new Error("Project not found");
            error.status = 404;
            return next(error);
        }

        const project = await getProjectById(projectId);

        if (!project) {
            const error = new Error("Project not found");
            error.status = 404;
            return next(error);
        }

        const organizations = await getAllOrganizations();

        res.render("edit-project", {
            title: "Edit Service Project",
            project,
            organizations
        });
    } catch (error) {
        console.error("Error loading edit project form:", error);
        next(error);
    }
};

// Process the edit service project form
const processEditProjectForm = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            const error = new Error("Project not found");
            error.status = 404;
            return next(error);
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash("error", error.msg);
            });

            return res.redirect(`/projects/edit/${projectId}`);
        }

        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        const updatedProjectId = await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash(
            "success",
            "Service project updated successfully!"
        );

        res.redirect(`/project/${updatedProjectId}`);
    } catch (error) {
        console.error("Error updating service project:", error);
        next(error);
    }
};



const processNewProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash("error", error.msg);
            });

            return res.redirect("/projects/new-project");
        }
        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash(
            "success",
            "New service project created successfully!"
        );

        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error("Error creating new project:", error);

        req.flash(
            "error",
            "There was an error creating the service project."
        );

        res.redirect("/new-project");
    }
};



export {
    buildProjects,
    buildProjectById,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};

