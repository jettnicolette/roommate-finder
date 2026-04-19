// habits route
import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";

const router = express.Router();

// Get all habits
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM habits");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get habit by ID
router.get("/:id", async (req, res) => {
  const habitId = parseInt(req.params.id, 10);
  if (isNaN(habitId)) {
    return res.status(400).json({ error: "Invalid habit ID" });
  } 

  try {   
    const result = await pool.query("SELECT * FROM habits WHERE habit_id = $1", [habitId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }
      res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching habit:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST a new habit
router.post("/", async (req, res) => {
  const { user_id, wake_time, sleep_time, study_hours } = req.body;
    if (!user_id || !wake_time || !sleep_time || !study_hours) {
      return res.status(400).json({ error: "Missing required fields" });
    }   
    try {
        const result = await pool.query(
            "INSERT INTO habits (user_id, wake_time, sleep_time, study_hours) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, wake_time, sleep_time, study_hours]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating habit:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a habit
router.put("/:id", async (req, res) => {
  const habitId = parseInt(req.params.id, 10);
  if (isNaN(habitId)) {
    return res.status(400).json({ error: "Invalid habit ID" });
  }
    const { wake_time, sleep_time, study_hours } = req.body;
    try {
        const result = await pool.query(
            "UPDATE habits SET wake_time = $1, sleep_time = $2, study_hours = $3 WHERE habit_id = $4 RETURNING *",
            [wake_time, sleep_time, study_hours, habitId]
        );  
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Habit not found" });
        }   
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating habit:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a habit
router.delete("/:id", async (req, res) => {
  const habitId = parseInt(req.params.id, 10);
    if (isNaN(habitId)) {
        return res.status(400).json({ error: "Invalid habit ID" });
    }
    try {
        const result = await pool.query("DELETE FROM habits WHERE habit_id = $1 RETURNING *", [habitId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Habit not found" });
        }
        res.json({ message: "Habit deleted successfully" });
    } catch (err) {
        console.error("Error deleting habit:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;