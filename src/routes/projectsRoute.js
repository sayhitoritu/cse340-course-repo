
import express from "express";

import {
    buildProjects,
    buildProjectById,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from "../controllers/projectsController.js";

const router = express.Router();

// Display all service projects
router.get("/", buildProjects);

// Display the new project form
router.get("/new-project", showNewProjectForm);

// Process the new project form
router.post(
    "/new-project",
    projectValidation,
    processNewProjectForm
);

// Display the edit project form
router.get("/edit/:id", showEditProjectForm);

// Process the edit project form
router.post(
    "/edit/:id",
    projectValidation,
    processEditProjectForm
);

// Display an individual project
router.get("/:id", buildProjectById);

export default router;

