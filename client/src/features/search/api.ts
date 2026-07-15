import type { Article, SearchResult } from "./types";

export const fetchSearchResults = async (
  query: string,
): Promise<SearchResult[]> => {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  return res.json();
};

export const fetchArticle = async (id: string): Promise<Article> => {
  const res = await fetch(`/api/articles/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(
      res.status === 404 ? "Article not found" : "Failed to load article",
    );
  }
  return res.json();
};
