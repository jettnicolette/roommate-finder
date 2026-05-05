import express from "express";
import { pool } from "../db";

const router = express.Router();

//GET /matches
router.get("/", async (req, res) => {
    try {
        const { user_id } = req.query;
        if (user_id) {
            const userId = Number(user_id);
            if (!Number.isInteger(userId) || userId <= 0) {
                return res.status(400).json({ error: "Invalid user ID" });
            }
            const result = await pool.query(
                `SELECT
                    match_id,
                    user1_id,
                    user2_id,
                    location_id,
                    status,
                    created_at,
                    accepted_at
                FROM match
                WHERE user1_id = $1 OR user2_id = $1`,
                [userId]
            );
            return res.status(200).json(result.rows);
        }

        const result = await pool.query(
            `SELECT
                match_id,
                user1_id,
                user2_id,
                location_id,
                status,
                created_at,
                accepted_at
            FROM match`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching matches:", error);
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

//SQL FUNCTION 
//PUT /matches/:id
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Use the accept_wave function for accepted status
        if (status === "accepted") {
            await pool.query(`SELECT * FROM accept_wave($1)`, [id]);
        } else {
            // For other statuses, use regular UPDATE
            const result = await pool.query(
                `UPDATE match
                SET status = $1
                WHERE match_id = $2`,
                [status, id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Match not found" });
            }
        }
        
        // Always fetch and return the full match record
        const finalResult = await pool.query(
            `SELECT
                match_id,
                user1_id,
                user2_id,
                location_id,
                status,
                created_at,
                accepted_at
            FROM match
            WHERE match_id = $1`,
            [id]
        );
        
        if (finalResult.rows.length === 0) {
            return res.status(404).json({ error: "Match not found" });
        }
        res.status(200).json(finalResult.rows[0]);
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
