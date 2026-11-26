
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

import {
    requireLogin,
    requireRole
} from "../controllers/users.js";

const router = express.Router();

// Display all service projects - Public
router.get("/", buildProjects);

// Display the new project form - Admin only
router.get(
    "/new-project",
    requireLogin,
    requireRole("admin"),
    showNewProjectForm
);

// Process the new project form - Admin only
router.post(
    "/new-project",
    requireLogin,
    requireRole("admin"),
    projectValidation,
    processNewProjectForm
);

// Display the edit project form - Admin only
router.get(
    "/edit/:id",
    requireLogin,
    requireRole("admin"),
    showEditProjectForm
);

// Process the edit project form - Admin only
router.post(
    "/edit/:id",
    requireLogin,
    requireRole("admin"),
    projectValidation,
    processEditProjectForm
);

// Display an individual project - Public
router.get("/:id", buildProjectById);

export default router;


