import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { books } from "./books";
import { news } from "./news";
import { math } from "./math";
import { github } from "./github";
import { feed, seedFeed } from "./feed";
import { catchup } from "./feed/catchup";

export const app = new Elysia()
  .use(cors())
  .use(books)
  .use(news)
  .use(math)
  .use(github)
  .use(feed)
  .use(catchup)
  .get("/health", () => ({ status: "ok" }));

if (import.meta.main) {
  app.listen(3000);
  console.log("unrot server running on http://localhost:3000");
  seedFeed();
}
