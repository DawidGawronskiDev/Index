import type { Document } from "../types.js";
import { countTerms } from "./count-terms.js";
import { getTermsFromDocument } from "./get-terms-from-document.js";

/**
 * Calculates the term frequencies for a given document.
 *
 * @param document - The Document object to calculate term frequencies from.
 * @returns A Map where keys are terms and values are their respective frequencies (as a fraction of total terms).
 */
export const getTermFrequenciesFromDocument = (
  document: Document,
): Map<string, number> => {
  const termFrequencies = new Map<string, number>();
  const terms = getTermsFromDocument(document);

  if (terms.length === 0) {
    return termFrequencies;
  }

  const termCounts = countTerms(terms);

  for (const [term, count] of termCounts.entries()) {
    termFrequencies.set(term, count / terms.length);
  }

  return termFrequencies;
};
