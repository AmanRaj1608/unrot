const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

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
};
