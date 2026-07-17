/**
 * Normalises a link to a Wikipedia article.
 *
 * @param href - The href attribute of the link.
 * @param baseUrl - The base URL of the page containing the link.
 * @returns The normalised URL of the Wikipedia article, or null if the link is not valid.
 *
 * @example
 * normaliseLink("/wiki/JavaScript", "https://en.wikipedia.org/wiki/Web_development");
 * // Returns: "https://en.wikipedia.org/wiki/JavaScript"
 *
 * normaliseLink("https://en.wikipedia.org/wiki/JavaScript", "https://en.wikipedia.org/wiki/Web_development");
 * // Returns: "https://en.wikipedia.org/wiki/JavaScript"
 *
 * normaliseLink("/wiki/File:Example.jpg", "https://en.wikipedia.org/wiki/Web_development");
 * // Returns: null (not a valid article link)
 */
export const normaliseLink = (href: string, baseUrl: string): string | null => {
  try {
    const url = new URL(href, baseUrl);

    // Only allow links to the English Wikipedia and to articles
    if (
      url.hostname !== "en.wikipedia.org" ||
      !url.pathname.startsWith("/wiki/")
    )
      return null;

    // Extract the article title from the URL path
    const article = url.pathname.slice("/wiki/".length);

    // Exclude links to special pages, files, or other non-article content
    if (article.includes(":")) return null;

    return `https://en.wikipedia.org/wiki/${article}`;
  } catch {
    return null;
  }
};
