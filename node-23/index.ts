import pg from "pg";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(express.json());
const port = 8001;

type Pokemon = {
  id: 149;
  name: string;
  type: string;
  avatar: string;
};

app.get("/pokemons", async (req, res) => {
  try {
    const pokemons = (
      await pool.query(`SELECT * FROM pokemons ORDER BY id DESC`)
    ).rows;

    res.json({
      total: pokemons.length,
      data: pokemons.map((p: Pokemon) => ({
        ...p,
        avatar: `https://pub-9a16cc00cefc4c5fa4788f22bf66b230.r2.dev${p.avatar}`,
      })),
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error?.message || "Something went wrong!" });
  }
});

app.post("/pokemons", async (req, res) => {
  try {
    const { name, type, image_path } = req.body;

    await pool.query(
      `INSERT INTO pokemons (name, type, avatar) VALUES ('${name}', '${type}', '${image_path}')`
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Something went wrong!" });
  }
});

app.delete("/pokemons/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query(`DELETE FROM pokemons WHERE id = ${id}`);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Something went wrong!" });
  }
});

app.get("/pokemons/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const pokemon = (
      await pool.query(`SELECT * FROM pokemons WHERE id = ${id} LIMIT 1`)
    ).rows[0];

    res.json(pokemon);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Something went wrong!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
