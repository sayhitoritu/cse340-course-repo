
import express from "express";

import {
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from "../controllers/organizationsController.js";

const router = express.Router();

// Create organization routes
router.get("/new-organization", showNewOrganizationForm);

router.post(
    "/new-organization",
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization route
router.get("/edit-organization/:id", showEditOrganizationForm);

router.post(
    "/edit-organization/:id",
    organizationValidation,
    processEditOrganizationForm
);

export default router;


