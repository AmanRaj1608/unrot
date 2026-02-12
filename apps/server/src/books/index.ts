import { Elysia, t } from "elysia";
import booksData from "./data/books.json";

const CATEGORIES = [
  "personal-growth",
  "habits",
  "love-relationships",
  "self-improvement",
  "public-speaking",
  "conversation-skills",
] as const;

export const books = new Elysia({ prefix: "/books" })
  .get("/categories", () => CATEGORIES)
  .get(
    "/",
    ({ query }) => {
      if (query.category) {
        return booksData.filter((b) => b.category === query.category);
      }
      return booksData;
    },
    { query: t.Object({ category: t.Optional(t.String()) }) }
  )
  .get("/:id", ({ params, set }) => {
    const book = booksData.find((b) => b.id === params.id);
    if (!book) {
      set.status = 404;
      return { error: "Book not found" };
    }
    return book;
  });
