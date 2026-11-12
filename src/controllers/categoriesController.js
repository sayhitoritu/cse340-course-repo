

import {
    getAllCategories,
    getCategoryById
} from "../models/categories.js";

import { getProjectsByCategoryId } from "../models/projects.js";

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

export {
    buildCategories,
    buildCategoryById
};

