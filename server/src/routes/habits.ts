// habits route
import express from "express";
import { pool } from "../db";

const router = express.Router();

// Get habits for a specific user
router.get("/user/:user_id", async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM habits WHERE user_id = $1",
      [userId]
    );
    // Return empty object if no habits exist yet
    if (result.rows.length === 0) {
      return res.json({
        user_id: userId,
        wake_time: null,
        sleep_time: null,
        study_hours: null,
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create or update habits for a user
router.put("/user/:user_id", async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const { wake_time, sleep_time, study_hours } = req.body;

  try {
    // Check if habits exist for this user
    const checkResult = await pool.query(
      "SELECT * FROM habits WHERE user_id = $1",
      [userId]
    );

    if (checkResult.rows.length > 0) {
      // Update existing habits
      const result = await pool.query(
        "UPDATE habits SET wake_time = $1, sleep_time = $2, study_hours = $3 WHERE user_id = $4 RETURNING *",
        [wake_time || null, sleep_time || null, study_hours || null, userId]
      );
      res.json(result.rows[0]);
    } else {
      // Insert new habits
      const result = await pool.query(
        "INSERT INTO habits (user_id, wake_time, sleep_time, study_hours) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, wake_time || null, sleep_time || null, study_hours || null]
      );
      res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error("Error saving habits:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete habits for a user
router.delete("/user/:user_id", async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM habits WHERE user_id = $1 RETURNING *",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No habits found for this user" });
    }
    res.json({ message: "Habits deleted successfully" });
  } catch (err) {
    console.error("Error deleting habits:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;