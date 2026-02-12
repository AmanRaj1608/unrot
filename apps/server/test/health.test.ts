import { describe, expect, it } from "bun:test";
import { app } from "../src/index";

describe("health check", () => {
  it("returns ok status", async () => {
    const res = await app.handle(new Request("http://localhost/health"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ status: "ok" });
  });
});
