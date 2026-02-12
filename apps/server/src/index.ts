import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { books } from "./books";

export const app = new Elysia()
  .use(cors())
  .use(books)
  .get("/health", () => ({ status: "ok" }));

if (import.meta.main) {
  app.listen(3000);
  console.log("unrot server running on http://localhost:3000");
}
