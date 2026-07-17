import type { Document, InvertedIndex, SearchResult } from "../types.js";
import { scoreDocuments } from "./scoring.js";

/**
 * Searches the corpus for the given query, ranked by BM25 score.
 *
 * @param query - The raw search query string.
 * @param invertedIndex - The inverted index to search against.
 * @param documentLookup - Map of document ID to Document, for resolving results.
 * @param documentLengths - Map of document ID to its total term count.
 * @param averageDocumentLength - The corpus's average document length.
 * @param limit - Maximum number of results to return.
 * @returns The top matching documents, highest score first.
 */
export const search = (
  query: string,
  invertedIndex: InvertedIndex,
  documentLookup: Map<Document["id"], Document>,
  documentLengths: Map<Document["id"], number>,
  averageDocumentLength: number,
  limit = 10,
): SearchResult[] => {
  const scores = scoreDocuments(
    query,
    invertedIndex,
    documentLookup.size,
    documentLengths,
    averageDocumentLength,
  );

  return [...scores.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([docId, score]) => {
      const document = documentLookup.get(docId)!;
      return { id: document.id, title: document.title, url: document.url, score };
    });
};
