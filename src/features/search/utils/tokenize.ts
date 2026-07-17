import { STOP_WORDS } from "../data.js";
import { cleanTerm } from "./clean-term.js";

const min_gram = 3;
const max_gram = 6;

/**
 * Tokenizes free text into cleaned, non-stopword terms. Shared by document
 * indexing and query parsing so both go through identical normalization.
 *
 * @param text - The raw text to tokenize.
 * @returns An array of filtered terms (strings).
 */
export const tokenize = (text: string): string[] => {
  const token = text
    .split(/\s+/)
    .map(cleanTerm)
    .filter((term) => term.length > 0)
    .filter((term) => !STOP_WORDS.has(term));

  const ngrams: string[] = [];
  for (const term of token) {
    for (let n = min_gram; n <= max_gram; n++) {
      for (let i = 0; i <= term.length - n; i++) {
        ngrams.push(term.slice(i, i + n));
      }
    }
  }

  return ngrams;
};
