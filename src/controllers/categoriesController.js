
import { body, validationResult } from "express-validator";

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from "../models/categories.js";

import {
    getProjectsByCategoryId,
    getProjectById
} from "../models/projects.js";

// Server-side validation for category forms
const categoryValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Category name must be between 3 and 100 characters.")
        .escape()
];

// Display all categories
const buildCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        res.render("categories", {
            title: "Service Project Categories",
            categories
        });
    } catch (error) {
        console.error("Error loading categories:", error);
        next(error);
    }
};

// Display a single category and its projects
const buildCategoryById = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }

        const category = await getCategoryById(categoryId);

        if (!category) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render("category", {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        console.error("Error loading category details:", error);
        next(error);
    }
};

// Display the new category form
const showNewCategoryForm = (req, res) => {
    res.render("new-category", {
        title: "Create New Category"
    });
};

// Process the new category form
const processNewCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash(
                "error",
                errors.array().map(error => error.msg).join(" ")
            );
            return res.redirect("/new-category");
        }

        const { name } = req.body;

        const newCategoryId = await createCategory(name);

        req.flash("success", "Category created successfully!");

        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        console.error("Error creating category:", error);
        next(error);
    }
};

// Display the edit category form
const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }

        const category = await getCategoryById(categoryId);

        if (!category) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }

        res.render("edit-category", {
            title: "Edit Category",
            category
        });
    } catch (error) {
        console.error("Error loading edit category form:", error);
        next(error);
    }
};

// Process the edit category form
const processEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash(
                "error",
                errors.array().map(error => error.msg).join(" ")
            );
            return res.redirect(`/edit-category/${categoryId}`);
        }

        const { name } = req.body;

        await updateCategory(categoryId, name);

        req.flash("success", "Category updated successfully!");

        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error("Error updating category:", error);
        next(error);
    }
};

// Display the category assignment form
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = Number(req.params.projectId);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            const error = new Error("Project not found");
            error.status = 404;
            return next(error);
        }

        const project = await getProjectById(projectId);

        if (!project) {
            const error = new Error("Project not found");
            error.status = 404;
            return next(error);
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        res.render("assign-categories", {
            title: "Assign Categories to Project",
            projectId,
            project,
            categories,
            assignedCategories
        });
    } catch (error) {
        console.error("Error loading category assignment form:", error);
        next(error);
    }
};

// Process category assignments
const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = Number(req.params.projectId);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            const error = new Error("Project not found");
            error.status = 404;
            return next(error);
        }

        const selectedCategoryIds = req.body.categoryIds || [];

        const categoryIds = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIds);

        req.flash("success", "Categories updated successfully!");

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Error updating project categories:", error);
        next(error);
    }
};

export {
    buildCategories,
    buildCategoryById,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation
};


