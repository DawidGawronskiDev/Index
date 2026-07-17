/**
 * Counts the occurrences of each term in a list of terms.
 *
 * @param terms - The terms to count.
 * @returns A Map where keys are terms and values are their respective counts.
 */
export const countTerms = (terms: string[]): Map<string, number> => {
  const termCounts = new Map<string, number>();

  for (const term of terms) {
    termCounts.set(term, (termCounts.get(term) || 0) + 1);
  }

  return termCounts;
};
