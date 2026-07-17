const alphaNumericRegex = /[^a-zA-Z0-9]/g;

/**
 * Cleans a term by converting it to lowercase and removing non-alphanumeric characters.
 *
 * @param term - The term to clean.
 * @returns The cleaned term as a string.
 */
export const cleanTerm = (term: string): string => {
  return term.toLowerCase().replace(alphaNumericRegex, "");
};
