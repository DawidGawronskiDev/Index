import type { Document, InvertedIndex } from "../types.js";
import { tokenize } from "./tokenize.js";

const getDocumentFrequency = (
  term: string,
  invertedIndex: InvertedIndex,
): number => {
  return invertedIndex.get(term)?.size || 0;
};

const getIdf = (
  term: string,
  invertedIndex: InvertedIndex,
  totalDocuments: number,
): number => {
  const documentFrequency = getDocumentFrequency(term, invertedIndex);

  if (documentFrequency === 0) {
    return 0;
  }

  return Math.log(totalDocuments / documentFrequency);
};

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
