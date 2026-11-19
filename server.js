import flash from "./src/middleware/flash.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";

import "dotenv/config";


import categoriesRoute from "./src/routes/categoriesRoute.js";
import organizationsRoute from "./src/routes/organizationsRoute.js";
import projectsRoute from "./src/routes/projectsRoute.js";
import organizationFormsRoute from "./src/routes/organizationFormsRoute.js";

const app = express();
const port = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up session management
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

// Use flash message middleware
app.use(flash);

// Allow Express to receive and process form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});
app.use((req, res, next) => {
    console.log("REQUEST RECEIVED:", req.method, req.url);
    next();
});

// New organization form routes
app.use("/", organizationFormsRoute);

// Organization routes
app.use("/organizations", organizationsRoute);
app.use("/organization", organizationsRoute);

// Project routes
app.use("/projects", projectsRoute);
app.use("/project", projectsRoute);

// Category routes
app.use("/categories", categoriesRoute);
app.use("/category", categoriesRoute);

// Exact category creation and editing routes
app.use("/", categoriesRoute);

// 404 handler
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
});

// Global error handler (404 and 500)
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;

    res.status(status).render("error", {
        title: status === 404 ? "Page Not Found" : "Server Error",
        code: status,
        message: status === 404
            ? "Sorry, the page you are looking for does not exist."
            : "Something went wrong. Please try again later."
    });
});



// Start Express server


app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
