import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";
import usersRouter from "./routes/users";
import habitsRouter from "./routes/habits";
import locationsRouter from "./routes/location";
import matchRouter from "./routes/match";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "API is running",
      dbTime: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/users", usersRouter);
app.use("/habits", habitsRouter);
app.use("/locations", locationsRouter);
app.use("/matches", matchRouter);
app.use("/auth", authRouter);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
