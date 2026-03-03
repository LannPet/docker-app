
import express from 'express'
import "dotenv/config";
import pool from "./db.js"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())

// Quick test route
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now");
    res.json({ ok: true, now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

// Fetch grocery items
app.get("/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("ITEMS ERROR:", err);
    res.status(500).json({
      error: "Failed to fetch items",
      detail: err.message,   // <- add this temporarily
      code: err.code         // <- add this temporarily
    });
  }
});

// Add grocery item
app.post("/items", async (req, res) => {
  const { name, amount } = req.body;
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const parsedAmount = Number(amount);

  // minimal validation
  if (!trimmedName || !Number.isInteger(parsedAmount) || parsedAmount < 1) {
    return res.status(400).json({ error: "name (string) and amount (int) are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO items (name, amount) VALUES ($1, $2) RETURNING *",
      [trimmedName, parsedAmount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Delete grocery item
app.delete("/items/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    const result = await pool.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Item not found" });
    res.json({ deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
