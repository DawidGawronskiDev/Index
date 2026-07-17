import { request } from "undici";
import * as cheerio from "cheerio";
import { upsertDocument, getAllDocuments } from "@/db";
import { getInvertedIndex, saveIndexCache } from "@/features/search/utils";

import "dotenv/config";
import { normaliseLink } from "./normaliseLink";

const SEED_URL = "https://en.wikipedia.org/wiki/Life";
const PAGE_LIMIT = 10000;
const USER_AGENT = process.env.USER_AGENT;

const visited: Set<string> = new Set();

const squareBracketsRegex = /\[.*?\]/g;

const EXCLUDED_HEADING_IDS = new Set([
  "See_also",
  "References",
  "External_links",
]);

const removeExcludedSections = ($: cheerio.CheerioAPI): void => {
  $("#mw-content-text .mw-parser-output")
    .first()
    .find("div.mw-heading")
    .each((_, headingWrapper) => {
      const headingId = $(headingWrapper).find("h2, h3").first().attr("id");
      if (!headingId || !EXCLUDED_HEADING_IDS.has(headingId)) return;

      $(headingWrapper).nextUntil("div.mw-heading").remove();
      $(headingWrapper).remove();
    });
};

const getContent = ($: cheerio.CheerioAPI): string => {
  return $("#mw-content-text .mw-parser-output")
    .first()
    .find("p")
    .map((_, el) => $(el).text().replace(squareBracketsRegex, "").trim())
    .get()
    .filter((text) => text.length > 0)
    .join("\n\n");
};

const queue: string[] = [SEED_URL];
visited.add(SEED_URL);
let fetchedCount = 0;

while (queue.length > 0 && fetchedCount < PAGE_LIMIT) {
  const url = queue.shift()!;

  try {
    const { body } = await request(url, {
      headers: { "User-Agent": USER_AGENT },
    });
    const $ = cheerio.load(await body.text());
    $("script, style").remove();
    removeExcludedSections($);

    const title = $("h1").first().text();
    if (!title) throw new Error("missing h1 title");

    const links = $("a")
      .map((_, el) => $(el).attr("href"))
      .get()
      .filter((href): href is string => href !== undefined);

    const content = getContent($);

    upsertDocument({ title, url, content });

    fetchedCount++;
    console.log(`[${fetchedCount}/${PAGE_LIMIT}] ${title}`);

    for (const link of links) {
      if (fetchedCount + queue.length >= PAGE_LIMIT) break;
      const normalized = normaliseLink(link, url);
      if (normalized && !visited.has(normalized)) {
        visited.add(normalized);
        queue.push(normalized);
      }
    }
  } catch (error) {
    console.error(`Skipping ${url}:`, error);
  }
}

console.log("Rebuilding search index cache...");
const documents = getAllDocuments();
const indexResult = await getInvertedIndex(documents);
saveIndexCache(indexResult);
console.log(
  `Index cache saved (${documents.length} documents, ${indexResult.invertedIndex.size} terms).`,
);
