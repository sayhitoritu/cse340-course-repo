
import express from "express";

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsers
} from "../controllers/users.js";

const router = express.Router();

// User registration routes
router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

// Login and logout routes
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);

// Protected dashboard route
router.get("/dashboard", requireLogin, showDashboard);

// Admin-only registered users route
router.get(
    "/users",
    requireLogin,
    requireRole("admin"),
    showUsers
);

export default router;




