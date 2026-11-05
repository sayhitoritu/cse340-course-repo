
import express from "express";

import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import pool from "./src/database/index.js";
import { getAllCategories } from "./src/models/categories.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/organizations", async (req, res) => {
    try {
        const organizations = await getAllOrganizations();

        console.log("Organizations retrieved:", organizations);

        res.render("organizations", {
            title: "Organizations",
            organizations: organizations
        });

    } catch (error) {
        console.error("Error loading organizations:", error);
        res.status(500).send("Unable to load organizations");
    }
});

app.get("/projects", async (req, res) => {
    try {
        const projects = await getAllProjects();

        console.log("Projects sent to EJS:", projects);

        res.render("projects", {
            title: "Service Projects",
            projects: projects
        });

    } catch (error) {
        console.error("Error loading projects:", error);
        res.status(500).send("Unable to load projects");
    }
});

app.get("/categories", async (req, res) => {
    try {
        const categories = await getAllCategories();
        console.log("Number of categories:", categories.length);

        console.log("Categories retrieved:", categories);

        res.render("categories", {
            title: "Service Project Categories",
            categories: categories
        });

    } catch (error) {
        console.error("Error loading categories:", error);
        res.status(500).send("Unable to load categories");
    }
});

pool.query("SELECT NOW()")
    .then((result) => {
        console.log("Database connected successfully!");
        console.log(result.rows[0]);
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
