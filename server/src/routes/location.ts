import express from "express";
import { pool } from "../db";

const router = express.Router();

// GET /locations
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
        `SELECT
            location_id,
            user_id,
            address,
            unit_number,
            city,
            state,
            zip_code,
            rent,
            is_oncampus,
            allows_pets
        FROM location
        ORDER BY location_id ASC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /locations error:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
  });

// GET locations from specific userID
router.get("/user/:userid", async (req, res) => {
  try {
    const userID = Number(req.params.userid);
    if (!Number.isInteger(userID) || userID <= 0) {
      return res.status(400).json({ error: "Invalid location ID" });
    }

    const result = await pool.query(
      'SELECT location_id, user_id, address, unit_number, city, state, zip_code, rent, is_oncampus, allows_pets FROM location WHERE user_id = $1',
      [userID]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /locations/user/:userid error:", error);
    res.status(500).json({ error: "Failed to fetch location by specified ID" });
  }
});

  // GET locations by ID
router.get("/:id", async (req, res) => {
  try {
    const locationID = Number(req.params.id);
    if (!Number.isInteger(locationID) || locationID <= 0) {
      return res.status(400).json({ error: "Invalid location ID" });
    }

    const result = await pool.query(
      'SELECT user_id, address, unit_number, city, state, zip_code, rent, is_oncampus, allows_pets FROM location WHERE location_id = $1',
      [locationID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /locations/:id error:", error);
    res.status(500).json({ error: "Failed to fetch location by specified ID" });
  }
});

  // POST /locations
  router.post("/", async (req, res) => {
    try {
      const { user_id, address, unit_number, city, state, zip_code, rent, is_oncampus, allows_pets } = req.body; 

      const result = await pool.query(
        `INSERT INTO location (user_id, address, unit_number, city, state, zip_code, rent, is_oncampus, allows_pets)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [user_id, address, unit_number, city, state, zip_code, rent, is_oncampus, allows_pets]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("POST /locations error:", error);
      res.status(500).json({ error: "Failed to create location" });
    }
  });

  // PUT /locations/:id
  router.put("/:id", async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);
      const { user_id, address, unit_number, city, state, zip_code, rent, is_oncampus, allows_pets } = req.body;

      const result = await pool.query(
        `UPDATE location
          SET address = $1, unit_number = $2, city = $3, state = $4, zip_code = $5, rent = $6, is_oncampus = $7, allows_pets = $8
          WHERE location_id = $9 AND user_id = $10
          RETURNING *`,
        [address, unit_number, city, state, zip_code, rent, is_oncampus, allows_pets, locationId, user_id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: "Location not found" });
        return;
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("PUT /locations/:id error:", error);
      res.status(500).json({ error: "Failed to update location" });
    }
  });

// DELETE /locations/:id
  router.delete("/:id", async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);

      const result = await pool.query(
        `DELETE FROM location WHERE location_id = $1 RETURNING *`,
        [locationId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: "Location not found" });
        return;
      }

      res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
      console.error("DELETE /locations/:id error:", error);
      res.status(500).json({ error: "Failed to delete location" });
    }
  });

  export default router;
  