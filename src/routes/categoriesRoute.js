
import express from "express";

import {
    buildCategories,
    buildCategoryById
} from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/", buildCategories);
router.get("/:id", buildCategoryById);

export default router;
