import { describe, expect, it } from "bun:test";
import { app } from "../src/index";

function req(path: string) {
  return app.handle(new Request(`http://localhost${path}`));
}

describe("GitHub API", () => {
  describe("GET /github/repos/:owner/:repo/pulls", () => {
    it("returns pull requests for a public repo", async () => {
      const res = await req("/github/repos/elysiajs/elysia/pulls");

      if (res.status === 403) {
        console.log("GitHub rate limit hit — skipping");
        return;
      }

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);

      if (body.length > 0) {
        const pr = body[0];
        expect(pr).toHaveProperty("id");
        expect(pr).toHaveProperty("number");
        expect(pr).toHaveProperty("title");
        expect(pr).toHaveProperty("author");
        expect(pr).toHaveProperty("state");
        expect(pr).toHaveProperty("createdAt");
        expect(pr).toHaveProperty("updatedAt");
        expect(pr).toHaveProperty("htmlUrl");
      }
    });

    it("returns 502 for nonexistent repo", async () => {
      const res = await req(
        "/github/repos/this-owner-does-not-exist-12345/nope/pulls"
      );

      if (res.status === 403) {
        console.log("GitHub rate limit hit — skipping");
        return;
      }

      expect(res.status).toBe(502);
    });
  });
});
