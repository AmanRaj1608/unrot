import { Elysia, t } from "elysia";
import { fetchTldr } from "./scraper";
import { getCached, setCache } from "./cache";

const CATEGORIES = ["ai", "crypto", "devops", "founders"] as const;

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export const news = new Elysia({ prefix: "/news" })
  .get("/categories", () => CATEGORIES)
  .get(
    "/:category/:date",
    async ({ params, set }) => {
      if (!CATEGORIES.includes(params.category as (typeof CATEGORIES)[number])) {
        set.status = 400;
        return { error: "Invalid category" };
      }

      const cached = getCached(params.category, params.date);
      if (cached) return cached;

      try {
        const articles = await fetchTldr(params.category, params.date);
        setCache(params.category, params.date, articles);
        return articles;
      } catch (err) {
        set.status = 502;
        return { error: "Failed to fetch news" };
      }
    },
    {
      params: t.Object({ category: t.String(), date: t.String() }),
    }
  )
  .get(
    "/:category",
    async ({ params, set }) => {
      if (!CATEGORIES.includes(params.category as (typeof CATEGORIES)[number])) {
        set.status = 400;
        return { error: "Invalid category" };
      }

      const date = today();
      const cached = getCached(params.category, date);
      if (cached) return cached;

      try {
        const articles = await fetchTldr(params.category, date);
        setCache(params.category, date, articles);
        return articles;
      } catch (err) {
        set.status = 502;
        return { error: "Failed to fetch news" };
      }
    },
    {
      params: t.Object({ category: t.String() }),
    }
  );
