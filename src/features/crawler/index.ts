import { request } from "undici";
import * as cheerio from "cheerio";
import { upsertDocument } from "@/db";

import "dotenv/config";
import { normaliseLink } from "./normaliseLink";

const SEED_URL = "https://en.wikipedia.org/wiki/Psychology";
const PAGE_LIMIT = 100;
const USER_AGENT = process.env.USER_AGENT;

const visited: Set<string> = new Set();

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

    upsertDocument({ title, url });

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
