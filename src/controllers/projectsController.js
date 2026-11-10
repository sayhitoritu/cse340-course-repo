
import {
    getAllProjects,
    getProjectById
} from "../models/projects.js";

import { getCategoriesByProjectId } from "../models/categories.js";

const buildProjects = async (req, res) => {
    try {
        const projects = await getAllProjects();

        res.render("projects", {
            title: "Service Projects",
            projects
        });
    } catch (error) {
        console.error("Error loading projects:", error);
        res.status(500).send("Unable to load projects");
    }
};

const buildProjectById = async (req, res) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(404).send("Project not found");
        }

        const project = await getProjectById(projectId);

        if (!project) {
            return res.status(404).send("Project not found");
        }

        const categories = await getCategoriesByProjectId(projectId);

        res.render("project", {
            title: project.name,
            project,
            categories
        });
    } catch (error) {
        console.error("Error loading project details:", error);
        res.status(500).send("Unable to load project details");
    }
};

export {
    buildProjects,
    buildProjectById
};
