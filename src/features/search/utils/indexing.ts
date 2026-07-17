import type { Document, InvertedIndex } from "../types.js";
import { tokenize } from "./tokenize.js";

const countTerms = (terms: string[]): Map<string, number> => {
  const termCounts = new Map<string, number>();

  for (const term of terms) {
    termCounts.set(term, (termCounts.get(term) || 0) + 1);
  }

  return termCounts;
};

const getTermFrequenciesFromDocument = (
  document: Document,
): Map<string, number> => {
  const termFrequencies = new Map<string, number>();
  const terms = tokenize(`${document.title} ${document.content}`);

  if (terms.length === 0) {
    return termFrequencies;
  }

  const termCounts = countTerms(terms);

  for (const [term, count] of termCounts.entries()) {
    termFrequencies.set(term, count / terms.length);
  }

  return termFrequencies;
};

/**
 * Creates an inverted index from a list of documents.
 *
 * @param documents - Documents to index.
 * @returns A Map from term to a Map of document ID to term frequency.
 */
export const getInvertedIndex = async (
  documents: Document[],
): Promise<InvertedIndex> => {
  const invertedIndex: InvertedIndex = new Map();

  for (const document of documents) {
    const termFrequencies = getTermFrequenciesFromDocument(document);

    for (const [term, frequency] of termFrequencies.entries()) {
      if (!invertedIndex.has(term)) {
        invertedIndex.set(term, new Map());
      }
      invertedIndex.get(term)!.set(document.id, frequency);
    }
  }

  return invertedIndex;
};
