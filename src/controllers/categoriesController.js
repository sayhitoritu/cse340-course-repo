
import {
    getAllCategories,
    getCategoryById
} from "../models/categories.js";

import { getProjectsByCategoryId } from "../models/projects.js";

const buildCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();

        res.render("categories", {
            title: "Service Project Categories",
            categories
        });
    } catch (error) {
        console.error("Error loading categories:", error);
        res.status(500).send("Unable to load categories");
    }
};

const buildCategoryById = async (req, res) => {
    try {
        const categoryId = Number(req.params.id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            return res.status(404).send("Category not found");
        }

        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).send("Category not found");
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render("category", {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        console.error("Error loading category details:", error);
        res.status(500).send("Unable to load category details");
    }
};

export {
    buildCategories,
    buildCategoryById
};
