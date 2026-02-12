import { describe, expect, it, mock, beforeEach } from "bun:test";
import { parseTldr } from "../src/news/scraper";
import { app } from "../src/index";

const fixture = await Bun.file(
  new URL("./fixtures/tldr-sample.html", import.meta.url).pathname
).text();

function req(path: string) {
  return app.handle(new Request(`http://localhost${path}`));
}

describe("TLDR scraper", () => {
  it("extracts articles from HTML", () => {
    const articles = parseTldr(fixture);

    expect(articles.length).toBe(3);
  });

  it("parses title, url, and summary", () => {
    const articles = parseTldr(fixture);
    const first = articles[0];

    expect(first.title).toBe(
      "OpenAI Launches GPT-5 with Major Reasoning Upgrades"
    );
    expect(first.url).toBe("https://example.com/article-1");
    expect(first.summary).toContain("mathematical reasoning");
  });

  it("extracts section names", () => {
    const articles = parseTldr(fixture);

    expect(articles[0].section).toBe("Big Tech & Startups");
    expect(articles[2].section).toBe("Programming");
  });

  it("extracts read time", () => {
    const articles = parseTldr(fixture);

    expect(articles[0].readTime).toBe(4);
    expect(articles[2].readTime).toBe(5);
  });

  it("filters out sponsor sections", () => {
    const articles = parseTldr(fixture);

    for (const article of articles) {
      expect(article.section).not.toBe("Sponsor");
    }
  });
});

describe("news API", () => {
  describe("GET /news/categories", () => {
    it("returns available categories", async () => {
      const res = await req("/news/categories");
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toContain("tech");
      expect(body).toContain("ai");
      expect(body).toContain("webdev");
      expect(body).toContain("infosec");
      expect(body).toContain("design");
      expect(body).toContain("crypto");
      expect(body).toContain("devops");
      expect(body).toContain("founders");
    });
  });
});
