
import express from "express";

import {
    buildProjects,
    buildProjectById
} from "../controllers/projectsController.js";

const router = express.Router();

router.get("/", buildProjects);
router.get("/:id", buildProjectById);

export default router;
