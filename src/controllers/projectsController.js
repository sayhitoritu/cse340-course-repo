

import {
    getAllProjects,
    getProjectById
} from "../models/projects.js";

import { getCategoriesByProjectId } from "../models/categories.js";

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

export {
    buildProjects,
    buildProjectById
};

