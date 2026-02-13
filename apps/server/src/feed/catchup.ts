import { Elysia, t } from "elysia";
import { fetchTldr } from "../news/scraper";

export const catchup = new Elysia({ prefix: "/catchup" }).get(
  "/:date",
  async ({ params, set }) => {
    try {
      return await fetchTldr("tech", params.date);
    } catch {
      set.status = 502;
      return { error: "Failed to fetch TLDR digest" };
    }
  },
  {
    params: t.Object({ date: t.String() }),
  }
);
