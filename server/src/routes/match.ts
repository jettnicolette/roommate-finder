import express from "express";
import { pool } from "../db";

const router = express.Router();

//GET /matches
router.get("/", async (_req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                match_id,
                user1_id,
                user2_id,
                location_id,
                status
            FROM match`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /matches/:id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT
                match_id,
                user1_id,
                user2_id,
                location_id,
                status
            FROM match
            WHERE match_id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Match not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching match:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//POST /matches
router.post("/", async (req, res) => {
    try {
        const { user1_id, user2_id, location_id, status } = req.body;
        const result = await pool.query(
            `INSERT INTO match (user1_id, user2_id, location_id, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *`
        , [user1_id, user2_id, location_id, status]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating match:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//PUT /matches/:id
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await pool.query(
            `UPDATE match
            SET status = $1
            WHERE match_id = $2
            RETURNING *`,
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Match not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating match:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//DELETE /matches/:id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `DELETE FROM match
            WHERE match_id = $1
            RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Match not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error deleting match:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
