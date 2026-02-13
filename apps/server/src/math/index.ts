import { Elysia } from "elysia";
import topicsData from "./data/topics.json";

const CATEGORIES = [
  ...new Set(topicsData.map((t) => t.category)),
] as string[];

export const math = new Elysia({ prefix: "/math" })
  .get("/categories", () => CATEGORIES)
  .get("/topics", () =>
    topicsData.map(({ id, title, category }) => ({ id, title, category }))
  )
  .get("/topics/:id", ({ params, set }) => {
    const topic = topicsData.find((t) => t.id === params.id);
    if (!topic) {
      set.status = 404;
      return { error: "Topic not found" };
    }
    return topic;
  })
  .get("/random", () => {
    const index = Math.floor(Math.random() * topicsData.length);
    return topicsData[index];
  });
