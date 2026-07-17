import type { Document } from "../types.js";
import { tokenize } from "./tokenize.js";

/**
 * Extracts terms from a document, filtering out stop words and non-alphanumeric terms.
 *
 * @param document - The document to extract terms from.
 * @returns An array of filtered terms (strings).
 */
export const getTermsFromDocument = (document: Document): string[] => {
  const text = document.sections
    .map((block) => block.text)
    .join(" ");

  return tokenize(text);
};
