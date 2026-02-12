import { describe, expect, it } from "bun:test";
import { app } from "../src/index";

function req(path: string) {
  return app.handle(new Request(`http://localhost${path}`));
}

describe("math API", () => {
  describe("GET /math/categories", () => {
    it("returns all math categories", async () => {
      const res = await req("/math/categories");
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toContain("Algebra");
      expect(body).toContain("Calculus");
      expect(body).toContain("Trigonometry");
      expect(body).toContain("Coordinate Geometry");
      expect(body).toContain("Three-Dimensional Geometry");
      expect(body).toContain("Vector Algebra");
      expect(body).toContain("Statistics and Probability");
    });
  });

  describe("GET /math/topics", () => {
    it("returns all topics with id, title, category", async () => {
      const res = await req("/math/topics");
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);

      const topic = body[0];
      expect(topic).toHaveProperty("id");
      expect(topic).toHaveProperty("title");
      expect(topic).toHaveProperty("category");
      expect(topic).not.toHaveProperty("explanation");
    });
  });

  describe("GET /math/topics/:id", () => {
    it("returns a specific topic with explanation", async () => {
      const listRes = await req("/math/topics");
      const topics = await listRes.json();
      const firstId = topics[0].id;

      const res = await req(`/math/topics/${firstId}`);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.id).toBe(firstId);
      expect(body).toHaveProperty("explanation");
      expect(body.explanation.length).toBeGreaterThan(50);
    });

    it("returns 404 for unknown id", async () => {
      const res = await req("/math/topics/nonexistent");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /math/random", () => {
    it("returns a valid topic with explanation", async () => {
      const res = await req("/math/random");
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toHaveProperty("id");
      expect(body).toHaveProperty("title");
      expect(body).toHaveProperty("category");
      expect(body).toHaveProperty("explanation");
    });
  });
});
