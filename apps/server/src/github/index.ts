import { Elysia, t } from "elysia";

interface GitHubPR {
  id: number;
  number: number;
  title: string;
  user: { login: string } | null;
  body: string | null;
  state: string;
  created_at: string;
  updated_at: string;
  html_url: string;
}

interface PullRequest {
  id: number;
  number: number;
  title: string;
  author: string;
  description: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

const cache = new Map<string, { data: PullRequest[]; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string): PullRequest[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: PullRequest[]): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

export const github = new Elysia({ prefix: "/github" }).get(
  "/repos/:owner/:repo/pulls",
  async ({ params, set }) => {
    const cacheKey = `${params.owner}/${params.repo}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://api.github.com/repos/${params.owner}/${params.repo}/pulls?state=all&per_page=20&sort=updated`;
      const res = await fetch(url, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });

      if (res.status === 403) {
        set.status = 403;
        return { error: "GitHub API rate limit exceeded" };
      }

      if (!res.ok) {
        set.status = 502;
        return { error: "Failed to fetch pull requests" };
      }

      const raw: GitHubPR[] = await res.json();
      const pulls: PullRequest[] = raw.map((pr) => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        author: pr.user?.login ?? "unknown",
        description: pr.body ?? "",
        state: pr.state,
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
        htmlUrl: pr.html_url,
      }));

      setCache(cacheKey, pulls);
      return pulls;
    } catch {
      set.status = 502;
      return { error: "Failed to fetch pull requests" };
    }
  },
  {
    params: t.Object({ owner: t.String(), repo: t.String() }),
  }
);
