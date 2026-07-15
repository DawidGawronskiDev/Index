import type { Document, InvertedIndex } from "../types";
import { getTermFrequenciesFromDocument } from "./get-term-frequencies-from-document";

/**
 * Creates an inverted index from a list of documents.
 *
 * @param documents - An array of Document objects to create the inverted index from.
 * @returns A Promise that resolves to a Map where keys are terms and values are Maps of document IDs and their term frequencies.
 * @throws An error if any document cannot be processed.
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
