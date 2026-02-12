import Constants from "expo-constants";

function getBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // In dev, use the same host that Expo is serving from
  const debuggerHost =
    Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    return `http://${host}:3000`;
  }
  return "http://localhost:3000";
}

const BASE_URL = getBaseUrl();

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  category: string;
  summary: string;
  keyTakeaways: string[];
}

export interface Article {
  title: string;
  url: string;
  summary: string;
  section: string;
  readTime: number;
}

export interface MathTopic {
  id: string;
  title: string;
  category: string;
  explanation?: string;
}

export interface PullRequest {
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

export const api = {
  books: {
    list: (category?: string) =>
      get<Book[]>(`/books${category ? `?category=${category}` : ""}`),
    get: (id: string) => get<Book>(`/books/${id}`),
    categories: () => get<string[]>("/books/categories"),
  },
  news: {
    get: (category: string) => get<Article[]>(`/news/${category}`),
    categories: () => get<string[]>("/news/categories"),
  },
  math: {
    random: () => get<MathTopic>("/math/random"),
    topics: () => get<MathTopic[]>("/math/topics"),
    get: (id: string) => get<MathTopic>(`/math/topics/${id}`),
    categories: () => get<string[]>("/math/categories"),
  },
  github: {
    pulls: (owner: string, repo: string) =>
      get<PullRequest[]>(`/github/repos/${owner}/${repo}/pulls`),
  },
};
