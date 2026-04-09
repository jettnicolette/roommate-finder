import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";

const router = express.Router();
const SALT_ROUNDS = 10;

// GET /users
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        user_id,
        username,
        email,
        phone_number,
        real_name,
        grad_year,
        is_oncampus,
        gender,
        major,
        home_state
      FROM users
      ORDER BY user_id ASC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /users/:id
router.get("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await pool.query(
      `SELECT
        user_id,
        username,
        email,
        phone_number,
        real_name,
        grad_year,
        is_oncampus,
        gender,
        major,
        home_state
      FROM users
      WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /users/:id error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /users
router.post("/", async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      phone_number,
      real_name,
      grad_year,
      is_oncampus,
      gender,
      major,
      home_state,
    } = req.body;

    if (!username || !password || !email || !real_name || typeof is_oncampus !== "boolean") {
      return res.status(400).json({
        error:
          "username, password, email, real_name, and is_oncampus are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

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

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("POST /users error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Username, email, or phone number already exists",
      });
    }

    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT /users/:id
router.put("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const {
      username,
      password,
      email,
      phone_number,
      real_name,
      grad_year,
      is_oncampus,
      gender,
      major,
      home_state,
    } = req.body;

    if (!username || !email || !real_name || typeof is_oncampus !== "boolean") {
      return res.status(400).json({
        error: "username, email, real_name, and is_oncampus are required",
      });
    }

    let hashedPassword: string | null = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const result = await pool.query(
      `UPDATE users
      SET
        username = $1,
        hashed_password = COALESCE($2, hashed_password),
        email = $3,
        phone_number = $4,
        real_name = $5,
        grad_year = $6,
        is_oncampus = $7,
        gender = $8,
        major = $9,
        home_state = $10
      WHERE user_id = $11
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
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("PUT /users/:id error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Username, email, or phone number already exists",
      });
    }

    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE /users/:id
router.delete("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await pool.query(
      `DELETE FROM users
      WHERE user_id = $1
      RETURNING user_id, username`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE /users/:id error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
