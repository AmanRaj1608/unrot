import { Elysia, t } from "elysia";
import { redis } from "../redis";
import { fetchTldr, type Article } from "../news/scraper";

const VALID_USERS = ["aman", "another"];

function today(): string {
  return new Date().toISOString().split("T")[0];
}

interface FeedItem {
  type: "news" | "github";
  id: string;
  // news fields
  title?: string;
  url?: string;
  summary?: string;
  section?: string;
  readTime?: number;
  // github fields
  number?: number;
  author?: string;
  state?: string;
  htmlUrl?: string;
  repoFullName?: string;
}

function articleToFeedItem(article: Article): FeedItem {
  return {
    type: "news",
    id: article.url,
    title: article.title,
    url: article.url,
    summary: article.summary,
    section: article.section,
    readTime: article.readTime,
  };
}

interface GitHubPR {
  id: number;
  number: number;
  title: string;
  user: { login: string } | null;
  body: string | null;
  state: string;
  html_url: string;
}

async function fetchGitHubPRs(owner: string, repo: string): Promise<FeedItem[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=10&sort=updated`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return [];

  const raw: GitHubPR[] = await res.json();
  return raw.map((pr) => ({
    type: "github" as const,
    id: `pr:${owner}/${repo}/${pr.number}`,
    title: pr.title,
    number: pr.number,
    author: pr.user?.login ?? "unknown",
    state: pr.state,
    htmlUrl: pr.html_url,
    repoFullName: `${owner}/${repo}`,
  }));
}

export async function seedFeed(): Promise<void> {
  const count = await redis.llen("feed:items");
  if (count > 0) return;

  console.log("seeding feed with today's TLDR tech...");
  try {
    const articles = await fetchTldr("tech", today());
    const items = articles.slice(0, 40).map(articleToFeedItem);
    if (items.length === 0) return;

    const pipeline = redis.pipeline();
    for (const item of items) {
      pipeline.rpush("feed:items", JSON.stringify(item));
    }
    await pipeline.exec();
    console.log(`seeded ${items.length} feed items`);
  } catch (err) {
    console.error("failed to seed feed:", err);
  }
}

export const feed = new Elysia({ prefix: "/feed" })
  .get(
    "/",
    async ({ query, set }) => {
      const userId = query.userId;
      if (!userId || !VALID_USERS.includes(userId)) {
        set.status = 400;
        return { error: "Invalid userId" };
      }

      const raw = await redis.lrange("feed:items", 0, -1);
      const viewedSet = await redis.smembers(`viewed:${userId}`);
      const viewedIds = new Set(viewedSet);

      return raw.map((json) => {
        const item = JSON.parse(json) as FeedItem;
        return { ...item, viewed: viewedIds.has(item.id) };
      });
    },
    { query: t.Object({ userId: t.String() }) }
  )
  .post(
    "/refresh",
    async () => {
      const existing = await redis.lrange("feed:items", 0, -1);
      const existingIds = new Set(
        existing.map((json) => (JSON.parse(json) as FeedItem).id)
      );

      // Fetch news
      let newsItems: FeedItem[] = [];
      try {
        const articles = await fetchTldr("tech", today());
        newsItems = articles.map(articleToFeedItem);
      } catch {
        // scrape failed, continue with what we have
      }

      // Fetch GitHub PRs from configured repos
      let githubItems: FeedItem[] = [];
      const repos = await redis.smembers("feed:repos");
      for (const repoStr of repos) {
        const [owner, repo] = repoStr.split("/");
        if (owner && repo) {
          const prs = await fetchGitHubPRs(owner, repo);
          githubItems.push(...prs);
        }
      }

      // Diff: only add items we don't already have
      const allNew = [...newsItems, ...githubItems].filter(
        (item) => !existingIds.has(item.id)
      );

      if (allNew.length > 0) {
        // Prepend new items
        const pipeline = redis.pipeline();
        for (const item of allNew.reverse()) {
          pipeline.lpush("feed:items", JSON.stringify(item));
        }
        await pipeline.exec();

        // Trim to 40
        await redis.ltrim("feed:items", 0, 39);
      }

      return { added: allNew.length };
    }
  )
  .post(
    "/viewed",
    async ({ body, set }) => {
      if (!body.userId || !VALID_USERS.includes(body.userId)) {
        set.status = 400;
        return { error: "Invalid userId" };
      }
      await redis.sadd(`viewed:${body.userId}`, body.itemId);
      return { ok: true };
    },
    {
      body: t.Object({ userId: t.String(), itemId: t.String() }),
    }
  )
  .get("/repos", async () => {
    const repos = await redis.smembers("feed:repos");
    return repos;
  })
  .post(
    "/repos",
    async ({ body }) => {
      await redis.sadd("feed:repos", `${body.owner}/${body.repo}`);
      return { ok: true };
    },
    {
      body: t.Object({ owner: t.String(), repo: t.String() }),
    }
  )
  .delete(
    "/repos/:owner/:repo",
    async ({ params }) => {
      await redis.srem("feed:repos", `${params.owner}/${params.repo}`);
      return { ok: true };
    },
    {
      params: t.Object({ owner: t.String(), repo: t.String() }),
    }
  );
