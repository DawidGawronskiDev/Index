import crypto from "crypto";
import { request } from "undici";
import * as cheerio from "cheerio";
import type { Document } from "@/features/search/types";
import { upsertDocument } from "@/db";

import "dotenv/config";

const SEED_URL = "https://en.wikipedia.org/wiki/Psychology";
const PAGE_LIMIT = 100;
const USER_AGENT = process.env.USER_AGENT;

const visited: Set<string> = new Set();

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

    const links = $("a")
      .map((_, el) => $(el).attr("href"))
      .get()
      .filter((href): href is string => href !== undefined);

    const document: Document = {
      id: crypto.randomUUID(),
      title,
      url,
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
