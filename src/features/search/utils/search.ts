import type { Document, InvertedIndex, SearchResult } from "../types.js";
import { scoreDocuments } from "./score-documents.js";

/**
 * Searches the corpus for the given query, ranked by tf-idf score.
 *
 * @param query - The raw search query string.
 * @param invertedIndex - The inverted index to search against.
 * @param documentLookup - Map of document ID to Document, for resolving results.
 * @param limit - Maximum number of results to return.
 * @returns The top matching documents, highest score first.
 */
export const search = (
  query: string,
  invertedIndex: InvertedIndex,
  documentLookup: Map<Document["id"], Document>,
  limit = 10,
): SearchResult[] => {
  const scores = scoreDocuments(query, invertedIndex, documentLookup.size);

  return [...scores.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([docId, score]) => {
      const document = documentLookup.get(docId)!;
      return { id: document.id, title: document.title, url: document.url, score };
    });
};
