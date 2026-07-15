import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";
import type { Document } from "../search/types";
import { v4 as uuidv4 } from "uuid";

const SEED_URL = "https://en.wikipedia.org/wiki/Psychology";
const PAGE_LIMIT = 1000;
const OUTPUT_DIR = "documents";

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

const cleanParagraphs = (paragraphs: string[]) =>
  paragraphs.map((paragraph) => cleanParagraph(paragraph)).join("\n\n");

const normalizeLink = (href: string): string | null => {
  try {
    const url = new URL(href);
    if (url.hostname !== "en.wikipedia.org") return null;
    if (!url.pathname.startsWith("/wiki/")) return null;
    const article = url.pathname.slice("/wiki/".length);
    if (article.includes(":")) return null;
    return `https://en.wikipedia.org/wiki/${article}`;
  } catch {
    return null;
  }
};

const titleToFilename = (title: string): string =>
  title
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
});
const page = await browser.newPage();

const queue: string[] = [SEED_URL];
visited.add(SEED_URL);
let fetchedCount = 0;

while (queue.length > 0 && fetchedCount < PAGE_LIMIT) {
  const url = queue.shift()!;

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const title = await page.$eval("h1", (el) => el.textContent);
    const paragraphs = await page.$$eval("p", (elements) =>
      elements.map((el) => el.textContent),
    );
    const links = await page.$$eval("a", (elements) =>
      elements.map((el) => el.href),
    );

    if (!title) throw new Error("missing h1 title");

    const document: Document = {
      id: uuidv4(),
      title,
      url,
      content: cleanParagraphs(
        paragraphs.filter((p): p is string => p !== null),
      ),
    };

    const filename = `${titleToFilename(title)}.json`;
    await fs.writeFile(
      path.join(OUTPUT_DIR, filename),
      JSON.stringify(document, null, 2),
    );

    fetchedCount++;
    console.log(`[${fetchedCount}/${PAGE_LIMIT}] ${title}`);

    for (const link of links) {
      if (fetchedCount + queue.length >= PAGE_LIMIT) break;
      const normalized = normalizeLink(link);
      if (normalized && !visited.has(normalized)) {
        visited.add(normalized);
        queue.push(normalized);
      }
    }
  } catch (error) {
    console.error(`Skipping ${url}:`, error);
  }
}

await browser.close();
