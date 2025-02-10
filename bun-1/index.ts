import { sql } from "bun";
import express from "express";

const app = express();
app.use(express.json());
const port = 8003;

type Pokemon = {
  id: 149;
  name: string;
  type: string;
  avatar: string;
};

app.get("/pokemons", async (req, res) => {
  try {
    const pokemons = await sql(`SELECT * FROM pokemons ORDER BY id DESC`);

    res.json({
      total: pokemons.length,
      data: pokemons.map((p: Pokemon) => ({
        ...p,
        avatar: `https://pub-9a16cc00cefc4c5fa4788f22bf66b230.r2.dev${p.avatar}`,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Something went wrong!" });
  }
});

app.post("/pokemons", async (req, res) => {
  try {
    const { name, type, image_path } = req.body;

    console.log({ name, type, image_path });
    await sql(
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
    await sql(`DELETE FROM pokemons WHERE id = ${id}`);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Something went wrong!" });
  }
});

app.get("/pokemons/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const pokemon = await sql(`SELECT * FROM pokemons WHERE id = ${id} `);
    res.json(pokemon);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Something went wrong!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
