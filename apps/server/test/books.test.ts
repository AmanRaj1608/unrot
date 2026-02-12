import { describe, expect, it } from "bun:test";
import { app } from "../src/index";

function req(path: string) {
  return app.handle(new Request(`http://localhost${path}`));
}

describe("books API", () => {
  describe("GET /books/categories", () => {
    it("returns all categories", async () => {
      const res = await req("/books/categories");
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toContain("personal-growth");
      expect(body).toContain("habits");
      expect(body).toContain("love-relationships");
      expect(body).toContain("self-improvement");
      expect(body).toContain("public-speaking");
      expect(body).toContain("conversation-skills");
    });
  });

  describe("GET /books", () => {
    it("returns all books", async () => {
      const res = await req("/books");
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);

      const book = body[0];
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("author");
      expect(book).toHaveProperty("category");
      expect(book).toHaveProperty("summary");
      expect(book).toHaveProperty("keyTakeaways");
    });

    it("filters by category", async () => {
      const res = await req("/books?category=habits");
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.length).toBeGreaterThan(0);
      for (const book of body) {
        expect(book.category).toBe("habits");
      }
    });

    it("returns empty array for unknown category", async () => {
      const res = await req("/books?category=nonexistent");
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toEqual([]);
    });
  });

  describe("GET /books/:id", () => {
    it("returns a specific book", async () => {
      const allRes = await req("/books");
      const allBooks = await allRes.json();
      const firstBook = allBooks[0];

      const res = await req(`/books/${firstBook.id}`);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.id).toBe(firstBook.id);
      expect(body.title).toBe(firstBook.title);
    });

    it("returns 404 for unknown id", async () => {
      const res = await req("/books/nonexistent-id");
      expect(res.status).toBe(404);
    });
  });
});
