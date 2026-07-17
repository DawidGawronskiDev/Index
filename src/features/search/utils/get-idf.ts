import type { InvertedIndex } from "../types.js";
import { getDocumentFrequency } from "./get-document-frequency.js";

/**
 * Calculates the inverse document frequency (IDF) for a given term based on the inverted index and total number of documents.
 *
 * @param term - The term for which to calculate the IDF.
 * @param invertedIndex - The inverted index containing term-document mappings.
 * @param totalDocuments - The total number of documents in the corpus.
 * @returns The IDF value for the term. Returns 0 if the term is not found in any document.
 */
export const getIdf = (
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
