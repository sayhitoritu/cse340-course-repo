
import express from "express";

import {
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from "../controllers/organizationsController.js";

import {
    requireLogin,
    requireRole
} from "../controllers/users.js";

const router = express.Router();

// Create organization routes - Admin only
router.get(
    "/new-organization",
    requireLogin,
    requireRole("admin"),
    showNewOrganizationForm
);

router.post(
    "/new-organization",
    requireLogin,
    requireRole("admin"),
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization routes - Admin only
router.get(
    "/edit-organization/:id",
    requireLogin,
    requireRole("admin"),
    showEditOrganizationForm
);

router.post(
    "/edit-organization/:id",
    requireLogin,
    requireRole("admin"),
    organizationValidation,
    processEditOrganizationForm
);

export default router;



