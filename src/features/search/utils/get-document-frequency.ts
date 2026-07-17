import type { InvertedIndex } from "../types.js";

/**
 * Calculates the document frequency for a given term based on the inverted index.
 *
 * @param term - The term for which to calculate the document frequency.
 * @param invertedIndex - The inverted index containing term-document mappings.
 * @returns The number of documents that contain the term. Returns 0 if the term is not found in any document.
 */
export const getDocumentFrequency = (
  term: string,
  invertedIndex: InvertedIndex,
): number => {
  return invertedIndex.get(term)?.size || 0;
};
