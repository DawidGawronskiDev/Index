import fs from "fs";
import type { Document } from "../types.js";
import type { IndexResult } from "./indexing.js";

const CACHE_PATH = "index-cache.json";

type SerializedIndexResult = {
  invertedIndex: [string, [Document["id"], number][]][];
  documentLengths: [Document["id"], number][];
  averageDocumentLength: number;
};

/**
 * Serializes a built index to disk so the next process start can load it
 * instead of re-tokenizing every document from scratch.
 *
 * @param result - The index build result to persist.
 */
export const saveIndexCache = (result: IndexResult): void => {
  const serialized: SerializedIndexResult = {
    invertedIndex: [...result.invertedIndex.entries()].map(
      ([term, postings]) => [term, [...postings.entries()]],
    ),
    documentLengths: [...result.documentLengths.entries()],
    averageDocumentLength: result.averageDocumentLength,
  };

  fs.writeFileSync(CACHE_PATH, JSON.stringify(serialized));
};

/**
 * Loads a previously saved index cache, if one exists.
 *
 * @returns The cached index build result, or null if no cache file is present.
 */
export const loadIndexCache = (): IndexResult | null => {
  if (!fs.existsSync(CACHE_PATH)) {
    return null;
  }

  const serialized: SerializedIndexResult = JSON.parse(
    fs.readFileSync(CACHE_PATH, "utf-8"),
  );

  return {
    invertedIndex: new Map(
      serialized.invertedIndex.map(([term, postings]) => [
        term,
        new Map(postings),
      ]),
    ),
    documentLengths: new Map(serialized.documentLengths),
    averageDocumentLength: serialized.averageDocumentLength,
  };
};
