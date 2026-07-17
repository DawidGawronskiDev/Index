import type { Document, InvertedIndex } from "../types.js";
import { tokenize } from "./tokenize.js";

const K1 = 1.5;
const B = 0.75;

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

  return Math.log(
    (totalDocuments - documentFrequency + 0.5) / (documentFrequency + 0.5) +
      1,
  );
};

/**
 * Scores every document that shares at least one term with the query, using
 * BM25: idf-weighted term frequency that saturates (via k1) and is
 * normalized against the corpus's average document length (via b).
 *
 * @param query - The raw search query string.
 * @param invertedIndex - The inverted index to search against (raw term counts).
 * @param totalDocuments - The total number of documents in the corpus.
 * @param documentLengths - Map of document ID to its total term count.
 * @param averageDocumentLength - The corpus's average document length.
 * @returns A Map of document ID to score, unsorted.
 */
export const scoreDocuments = (
  query: string,
  invertedIndex: InvertedIndex,
  totalDocuments: number,
  documentLengths: Map<Document["id"], number>,
  averageDocumentLength: number,
): Map<Document["id"], number> => {
  const scores = new Map<Document["id"], number>();

  for (const term of tokenize(query)) {
    const idf = getIdf(term, invertedIndex, totalDocuments);
    const postings = invertedIndex.get(term);
    if (!postings) continue;

    for (const [docId, termFrequency] of postings) {
      const documentLength = documentLengths.get(docId) ?? 0;
      const lengthNorm =
        1 - B + B * (documentLength / averageDocumentLength);
      const numerator = termFrequency * (K1 + 1);
      const denominator = termFrequency + K1 * lengthNorm;

      scores.set(
        docId,
        (scores.get(docId) ?? 0) + idf * (numerator / denominator),
      );
    }
  }

  return scores;
};
