
import express from "express";

import {
    buildCategories,
    buildCategoryById,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation
} from "../controllers/categoriesController.js";

const router = express.Router();

// Display all categories
router.get("/", buildCategories);

// Create category
router.get("/new-category", showNewCategoryForm);
router.post("/new-category", categoryValidation, processNewCategoryForm);

// Edit category
router.get("/edit-category/:id", showEditCategoryForm);
router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);

// Assign categories to a project
router.get("/project/:projectId/assign-categories", showAssignCategoriesForm);
router.post("/project/:projectId/assign-categories", processAssignCategoriesForm);

// Display a single category
router.get("/:id", buildCategoryById);

export default router;
