
import bcrypt from "bcrypt";
import {
    createUser,
    authenticateUser,
    getAllUsers
} from "../models/users.js";

// Display registration form
const showUserRegistrationForm = (req, res) => {
    res.render("register", {
        title: "User Registration"
    });
};

// Process user registration
const processUserRegistrationForm = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            req.flash("error", "All fields are required.");
            return res.redirect("/register");
        }

        if (
            name.trim().length > 100 ||
            email.trim().length > 100 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            req.flash("error", "Please enter a valid name and email.");
            return res.redirect("/register");
        }

        if (
            password.length < 8 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            req.flash("error", "Password must be at least 8 characters and no more than 72 bytes.");
            return res.redirect("/register");
        }

        const saltRounds = 10;

        const passwordHash = await bcrypt.hash(
            password,
            saltRounds
        );

        await createUser(
            name.trim(),
            email.trim().toLowerCase(),
            passwordHash
        );

        req.flash("success", "Registration successful!");

        res.redirect("/");

    } catch (error) {
        if (error.code === "23505") {
            req.flash("error", "This email address is already registered.");
            return res.redirect("/register");
        }

        console.error("Registration error:", error);
        next(error);
    }
};

// Display login form
const showLoginForm = (req, res) => {
    if (
        req.query.logout === "success" &&
        !req.session.user
    ) {
        req.flash("success", "Logout successful!");
        return res.redirect("/login");
    }

    res.render("login", {
        title: "Login"
    });
};

// Process user login
const processLoginForm = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }

        const user = await authenticateUser(
            email.trim().toLowerCase(),
            password
        );

        if (!user) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }

        req.session.regenerate((error) => {
            if (error) {
                return next(error);
            }

            req.session.user = user;

            req.flash("success", "Login successful!");

            if (process.env.NODE_ENV === "development") {
                console.log("User logged in:", user.user_id);
            }

            req.session.save((error) => {
                if (error) {
                    return next(error);
                }

                res.redirect("/dashboard");
            });
        });

    } catch (error) {
        console.error("Error during login:", error);

        req.flash(
            "error",
            "An error occurred during login. Please try again."
        );

        res.redirect("/login");
    }
};

// Process user logout
const processLogout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie("connect.sid");

        res.redirect("/login?logout=success");
    });
};


// Middleware to protect routes
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash(
            "error",
            "You must be logged in to access that page."
        );

        return res.redirect("/login");
    }

    next();
};


// Display the authenticated user's dashboard

const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render("dashboard", {
        title: "Dashboard",
        name: user.name,
        email: user.email,
        role: user.role_name,
        isAdmin: user.role_name === "admin"
    });
};



// Middleware to protect routes based on user role
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash(
                "error",
                "You must be logged in to access that page."
            );

            return res.redirect("/login");
        }

        if (req.session.user.role_name !== role) {
            req.flash(
                "error",
                "You do not have permission to access that page."
            );

            return res.redirect("/dashboard");
        }

        next();
    };
};


// Display all registered users
const showUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.render("users", {
            title: "Registered Users",
            users: users
        });

    } catch (error) {
        console.error("Error retrieving users:", error);
        next(error);
    }
};







export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsers
};






