import crypto from "crypto";
import { request } from "undici";
import * as cheerio from "cheerio";
import type { ContentBlock, Document } from "../search/types";
import { upsertDocument } from "../../db";

import "dotenv/config";

const SEED_URL = "https://en.wikipedia.org/wiki/Psychology";
const PAGE_LIMIT = 100;
const USER_AGENT = process.env.USER_AGENT;

// ponytail: matches References/Bibliography/Further reading/Sources headings only.
// Wikipedia renders some of these via templates that don't always expand to a
// plain <li> list, so bibliography can come back empty on a handful of pages.
const BIBLIOGRAPHY_HEADING =
  /^(references|bibliography|further reading|sources)$/i;

const visited: Set<string> = new Set();

const alphaNumericRegex = /[a-zA-Z0-9]/;
const squareBracketsRegex = /\[.*?\]/g;

const cleanParagraph = (paragraph: string): string =>
  paragraph
    .trim()
    .replace(squareBracketsRegex, "")
    .split(" ")
    .map((term) => term.trim())
    .filter((term) => alphaNumericRegex.test(term) && term.length > 0)
    .join(" ");

const normalizeLink = (href: string, baseUrl: string): string | null => {
  try {
    const url = new URL(href, baseUrl);
    if (url.hostname !== "en.wikipedia.org") return null;
    if (!url.pathname.startsWith("/wiki/")) return null;
    const article = url.pathname.slice("/wiki/".length);
    if (article.includes(":")) return null;
    return `https://en.wikipedia.org/wiki/${article}`;
  } catch {
    return null;
  }
};

const extractSections = ($: cheerio.CheerioAPI): ContentBlock[] => {
  const blocks: ContentBlock[] = [];

  $("#mw-content-text .mw-parser-output")
    .first()
    .find("h2, h3, p")
    .each((_, el) => {
      const $el = $(el);

      if (el.tagName === "h2" || el.tagName === "h3") {
        const id = $el.attr("id");
        const text = $el.text().trim();
        if (id && text) {
          blocks.push({
            type: "heading",
            id,
            level: el.tagName === "h2" ? 2 : 3,
            text,
          });
        }
        return;
      }

      const text = cleanParagraph($el.text());
      if (text) blocks.push({ type: "paragraph", text });
    });

  return blocks;
};

const extractBibliography = ($: cheerio.CheerioAPI): string[] => {
  const entries: string[] = [];

  $("#mw-content-text .mw-parser-output")
    .first()
    .find("div.mw-heading")
    .each((_, headingWrapper) => {
      const headingText = $(headingWrapper)
        .find("h2, h3")
        .first()
        .text()
        .trim();
      if (!BIBLIOGRAPHY_HEADING.test(headingText)) return;

      $(headingWrapper)
        .nextUntil("div.mw-heading")
        .find("li")
        .each((_, li) => {
          const $li = $(li);
          const text = ($li.find(".mw-reference-text").text() || $li.text())
            .replace(/^↑\s*/, "")
            .trim();
          if (text) entries.push(text);
        });
    });

  return entries;
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

    const title = $("h1").first().text();
    if (!title) throw new Error("missing h1 title");

    const sections = extractSections($);
    const bibliography = extractBibliography($);
    const links = $("a")
      .map((_, el) => $(el).attr("href"))
      .get()
      .filter((href): href is string => href !== undefined);

    const document: Document = {
      id: crypto.randomUUID(),
      title,
      url,
      sections,
      bibliography,
    };

    upsertDocument(document);

    fetchedCount++;
    console.log(`[${fetchedCount}/${PAGE_LIMIT}] ${title}`);

    for (const link of links) {
      if (fetchedCount + queue.length >= PAGE_LIMIT) break;
      const normalized = normalizeLink(link, url);
      if (normalized && !visited.has(normalized)) {
        visited.add(normalized);
        queue.push(normalized);
      }
    }
  } catch (error) {
    console.error(`Skipping ${url}:`, error);
  }
}
