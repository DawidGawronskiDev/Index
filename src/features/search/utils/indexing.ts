import type { Document, InvertedIndex } from "../types.js";
import { tokenize } from "./tokenize.js";

const countTerms = (terms: string[]): Map<string, number> => {
  const termCounts = new Map<string, number>();

  for (const term of terms) {
    termCounts.set(term, (termCounts.get(term) || 0) + 1);
  }

  return termCounts;
};

export type IndexResult = {
  invertedIndex: InvertedIndex;
  documentLengths: Map<Document["id"], number>;
  averageDocumentLength: number;
};

/**
 * Creates an inverted index from a list of documents, along with each
 * document's length and the corpus's average length (needed for BM25's
 * length normalization).
 *
 * @param documents - Documents to index.
 */
export const getInvertedIndex = async (
  documents: Document[],
): Promise<IndexResult> => {
  const invertedIndex: InvertedIndex = new Map();
  const documentLengths = new Map<Document["id"], number>();

  for (const document of documents) {
    const terms = tokenize(`${document.title} ${document.content}`);
    documentLengths.set(document.id, terms.length);

    const termCounts = countTerms(terms);

    for (const [term, count] of termCounts.entries()) {
      if (!invertedIndex.has(term)) {
        invertedIndex.set(term, new Map());
      }
      invertedIndex.get(term)!.set(document.id, count);
    }
  }

  const totalLength = [...documentLengths.values()].reduce(
    (sum, length) => sum + length,
    0,
  );
  const averageDocumentLength =
    documents.length > 0 ? totalLength / documents.length : 0;

  return { invertedIndex, documentLengths, averageDocumentLength };
};
