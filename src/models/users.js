
import bcrypt from "bcrypt";
import pool from "../database/index.js";

// Create a new user
const createUser = async (name, email, passwordHash) => {
    const sql = `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role_id
        )
        VALUES (
            $1,
            $2,
            $3,
            (SELECT role_id FROM roles WHERE role_name = 'user')
        )
        RETURNING user_id;
    `;

    const result = await pool.query(sql, [
        name,
        email,
        passwordHash
    ]);

    return result.rows[0].user_id;
};


// Find a user by email, including their role
const findUserByEmail = async (email) => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            u.role_id,
            r.role_name
        FROM users u
        LEFT JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.email = $1
    `;

    const queryParams = [email];

    const result = await pool.query(
        query,
        queryParams
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};


// Verify the submitted password
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// Authenticate a user
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isPasswordValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        return null;
    }

    delete user.password_hash;

    return user;
};


// Retrieve all registered users with their roles
const getAllUsers = async () => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM users u
        LEFT JOIN roles r
            ON u.role_id = r.role_id
        ORDER BY u.name ASC
    `;

    const result = await pool.query(query);

    return result.rows;
};



export {
    createUser,
    authenticateUser,
    getAllUsers
};


