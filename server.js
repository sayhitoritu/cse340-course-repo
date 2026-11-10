
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import pool from "./src/database/index.js";

import categoriesRoute from "./src/routes/categoriesRoute.js";
import organizationsRoute from "./src/routes/organizationsRoute.js";
import projectsRoute from "./src/routes/projectsRoute.js";

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
app.use((req, res, next) => {
    console.log("REQUEST RECEIVED:", req.method, req.url);
    next();
});
// Organization routes
app.use("/organizations", organizationsRoute);
app.use("/organization", organizationsRoute);

// Project routes
app.use("/projects", projectsRoute);
app.use("/project", projectsRoute);

// Category routes
app.use("/categories", categoriesRoute);
app.use("/category", categoriesRoute);

// 404 handler
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Database connection test
console.log("Starting Express server...");

const server = app.listen(3000, "127.0.0.1", () => {
    console.log("SUCCESS: Express is listening!");
    console.log(server.address());
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});