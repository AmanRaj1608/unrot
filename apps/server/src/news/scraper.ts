import * as cheerio from "cheerio";

export interface Article {
  title: string;
  url: string;
  summary: string;
  section: string;
  readTime: number;
}

const EXCLUDED_SECTIONS = ["sponsor"];

export function parseTldr(html: string): Article[] {
  const $ = cheerio.load(html);
  const articles: Article[] = [];

  $("section").each((_, sectionEl) => {
    const sectionId = $(sectionEl).attr("id") || "";
    if (EXCLUDED_SECTIONS.includes(sectionId.toLowerCase())) return;

    const sectionName = $(sectionEl).find("header h3").first().text().trim();

    $(sectionEl)
      .find("article")
      .each((_, articleEl) => {
        const linkEl = $(articleEl).find("a").first();
        const url = linkEl.attr("href") || "";
        const rawTitle = $(articleEl).find("h3").first().text().trim();
        const summary = $(articleEl).find(".newsletter-html").text().trim();

        const readTimeMatch = rawTitle.match(/\((\d+)\s+minute\s+read\)/);
        const readTime = readTimeMatch ? parseInt(readTimeMatch[1], 10) : 0;
        const title = rawTitle.replace(/\s*\(\d+\s+minute\s+read\)/, "").trim();

        if (url && title) {
          articles.push({ title, url, summary, section: sectionName, readTime });
        }
      });
  });

  return articles;
}

const TLDR_BASE = "https://tldr.tech";

export async function fetchTldr(
  category: string,
  date: string
): Promise<Article[]> {
  const url = `${TLDR_BASE}/${category}/${date}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch TLDR: ${res.status} ${res.statusText}`);
  }
  const html = await res.text();
  return parseTldr(html);
}
