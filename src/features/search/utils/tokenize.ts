import { STOP_WORDS } from "../data.js";

const alphaNumericRegex = /[^a-zA-Z0-9]/g;

const cleanTerm = (term: string): string =>
  term.toLowerCase().replace(alphaNumericRegex, "");

/**
 * Tokenizes free text into cleaned, non-stopword words. Shared by document
 * indexing and query parsing so both go through identical normalization.
 *
 * @param text - The raw text to tokenize.
 * @returns An array of filtered terms (strings).
 */
export const tokenize = (text: string): string[] => {
  return text
    .split(/\s+/)
    .map(cleanTerm)
    .filter((term) => term.length > 0)
    .filter((term) => !STOP_WORDS.has(term));
};
