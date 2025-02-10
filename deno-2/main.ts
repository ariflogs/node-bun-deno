import { Application, Router } from "@oak/oak";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const router = new Router();
const databaseUrl = Deno.env.get("DATABASE_URL");
const pool = new Pool(databaseUrl, 20, true);

type Pokemon = {
  id: number;
  name: string;
  type: string;
  avatar: string;
};

router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/pokemons", async (context) => {
    const client = await pool.connect();

    try {
      const pokemons = (await client.queryObject(`SELECT * FROM pokemons`))
        .rows as Pokemon[];

      context.response.body = {
        total: pokemons.length,
        data: pokemons.map((p: Pokemon) => ({
          ...p,
          avatar: `https://pub-9a16cc00cefc4c5fa4788f22bf66b230.r2.dev${p.avatar}`,
        })),
      };
    } finally {
      client.release();
    }
  })
  .post("/pokemons", async (context) => {
    const body = await context.request.body.json();
    const client = await pool.connect();
    try {
      await client.queryObject(
        `INSERT INTO pokemons (name, type, avatar) VALUES ('${body.name}', '${body.type}', '${body.image_path}')`
      );
      context.response.body = {
        success: true,
      };
    } finally {
      client.release();
    }
  })
  .delete("/pokemons/:id", async (context) => {
    const id = context.params.id;
    const client = await pool.connect();

    try {
      await client.queryObject(`DELETE FROM pokemons WHERE id = ${id}`);
      context.response.body = {
        success: true,
      };
    } finally {
      client.release();
    }
  })
  .get("/pokemons/:id", async (context) => {
    const id = context.params.id;
    const client = await pool.connect();

    try {
      const pokemons = await client.queryObject(
        `SELECT * FROM pokemons WHERE id = ${id}`
      );
      context.response.body = pokemons.rows;
    } finally {
      client.release();
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8002 });
