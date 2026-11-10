
import express from "express";

import {
    buildOrganizations,
    buildOrganizationById
} from "../controllers/organizationsController.js";

const router = express.Router();

router.get("/", buildOrganizations);
router.get("/:id", buildOrganizationById);

export default router;
