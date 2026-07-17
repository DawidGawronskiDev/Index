import type { Document, InvertedIndex } from "../types";
import { getIdf } from "./get-idf";
import { tokenize } from "./tokenize";

/**
 * Scores every document that shares at least one term with the query, using
 * summed tf * idf across the query's terms.
 *
 * @param query - The raw search query string.
 * @param invertedIndex - The inverted index to search against.
 * @param totalDocuments - The total number of documents in the corpus.
 * @returns A Map of document ID to score, unsorted.
 */
export const scoreDocuments = (
  query: string,
  invertedIndex: InvertedIndex,
  totalDocuments: number,
): Map<Document["id"], number> => {
  const scores = new Map<Document["id"], number>();

  for (const term of tokenize(query)) {
    const idf = getIdf(term, invertedIndex, totalDocuments);
    const postings = invertedIndex.get(term);
    if (!postings) continue;

    for (const [docId, tf] of postings) {
      scores.set(docId, (scores.get(docId) ?? 0) + tf * idf);
    }
  }

  return scores;
};
