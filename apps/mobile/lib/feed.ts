import type { Article, Book, MathTopic, PullRequest } from "./api";

export type FeedFilter = "all" | "news" | "book" | "math" | "github";

export type FeedItem =
  | { type: "news"; data: Article; id: string }
  | { type: "book"; data: Book; id: string }
  | { type: "math"; data: MathTopic; id: string }
  | { type: "github"; data: PullRequest; id: string };
