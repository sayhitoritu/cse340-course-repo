
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

import {
    requireLogin,
    requireRole
} from "../controllers/users.js";

const router = express.Router();

// Display all categories - Public
router.get("/", buildCategories);

// Create category - Admin only
router.get(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    showNewCategoryForm
);

router.post(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    categoryValidation,
    processNewCategoryForm
);

// Edit category - Admin only
router.get(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    showEditCategoryForm
);

router.post(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    categoryValidation,
    processEditCategoryForm
);

// Assign categories to a project - Admin only
router.get(
    "/project/:projectId/assign-categories",
    requireLogin,
    requireRole("admin"),
    showAssignCategoriesForm
);

router.post(
    "/project/:projectId/assign-categories",
    requireLogin,
    requireRole("admin"),
    processAssignCategoriesForm
);

// Display a single category - Public
router.get("/:id", buildCategoryById);

export default router;

