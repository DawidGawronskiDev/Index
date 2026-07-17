import { STOP_WORDS } from "../data.js";

const alphaNumericRegex = /[^a-zA-Z0-9]/g;
const min_gram = 3;
const max_gram = 6;

const cleanTerm = (term: string): string =>
  term.toLowerCase().replace(alphaNumericRegex, "");

/**
 * Tokenizes free text into cleaned, non-stopword character n-grams. Shared by
 * document indexing and query parsing so both go through identical
 * normalization.
 *
 * @param text - The raw text to tokenize.
 * @returns An array of filtered n-gram terms (strings).
 */
export const tokenize = (text: string): string[] => {
  const terms = text
    .split(/\s+/)
    .map(cleanTerm)
    .filter((term) => term.length > 0)
    .filter((term) => !STOP_WORDS.has(term));

  const ngrams: string[] = [];
  for (const term of terms) {
    for (let n = min_gram; n <= max_gram; n++) {
      for (let i = 0; i <= term.length - n; i++) {
        ngrams.push(term.slice(i, i + n));
      }
    }
  }

  return ngrams;
};
