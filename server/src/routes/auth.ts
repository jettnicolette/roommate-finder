import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";

const router = express.Router();

// Number of salt rounds used when hashing passwords.
// 10 is a very normal default for a school project.
const SALT_ROUNDS = 10;

// POST /auth/register
// Creates a new user account.
router.post("/register", async (req, res) => {
  try {
    // Pull the expected fields off the request body.
    const {
      username,
      password,
      email,
      real_name,
      is_oncampus,
      phone_number,
      grad_year,
      gender,
      major,
      home_state,
    } = req.body;

    // Basic required-field validation.
    // Keep this simple for now.
    if (
      !username ||
      !password ||
      !email ||
      !real_name ||
      typeof is_oncampus !== "boolean"
    ) {
      return res.status(400).json({
        error:
          "username, password, email, real_name, and is_oncampus are required",
      });
    }

    // Hash the plain-text password before storing it in the database.
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert the new user into the users table.
    // Use parameterized SQL to avoid injection issues.
    const result = await pool.query(
      `INSERT INTO users (
        username,
        hashed_password,
        email,
        phone_number,
        real_name,
        grad_year,
        is_oncampus,
        gender,
        major,
        home_state
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        user_id,
        username,
        email,
        phone_number,
        real_name,
        grad_year,
        is_oncampus,
        gender,
        major,
        home_state`,
      [
        username,
        hashedPassword,
        email,
        phone_number ?? null,
        real_name,
        grad_year ?? null,
        is_oncampus,
        gender ?? null,
        major ?? null,
        home_state ?? null,
      ]
    );

    // Send the newly created user back to the frontend.
    // Notice we do NOT return hashed_password.
    return res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("POST /auth/register error:", error);

    // PostgreSQL unique-constraint violation.
    // This will happen if username/email/phone_number already exists.
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Username, email, or phone number already exists",
      });
    }

    return res.status(500).json({ error: "Failed to register user" });
  }
});

// POST /auth/login
// Checks a username/password pair and logs the user in.
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Require both username and password.
    if (!username || !password) {
      return res.status(400).json({
        error: "username and password are required",
      });
    }

    // Look up the user by username.
    // We need hashed_password here so we can compare it with bcrypt.
    const result = await pool.query(
      `SELECT
        user_id,
        username,
        hashed_password,
        email,
        phone_number,
        real_name,
        grad_year,
        is_oncampus,
        gender,
        major,
        home_state
      FROM users
      WHERE username = $1`,
      [username]
    );

    // If no user was found, login should fail.
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];

    // Compare the password the user typed with the hashed password in the DB.
    const passwordMatches = await bcrypt.compare(password, user.hashed_password);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Build a clean user object to send back.
    // Again, do NOT send hashed_password to the frontend.
    const safeUser = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      real_name: user.real_name,
      grad_year: user.grad_year,
      is_oncampus: user.is_oncampus,
      gender: user.gender,
      major: user.major,
      home_state: user.home_state,
    };

    return res.status(200).json(safeUser);
  } catch (error) {
    console.error("POST /auth/login error:", error);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

export default router;