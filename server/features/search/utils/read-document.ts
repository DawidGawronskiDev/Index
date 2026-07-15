import fs from "fs/promises";
import type { Document } from "../types";

/**
 * Reads a document from the specified filename and returns it as a Document object.
 *
 * @param filename - The name of the file to read from the "documents" directory.
 * @returns A Promise that resolves to a Document object containing the title, URL, and content.
 * @throws An error if the file cannot be read or parsed.
 */
export const readDocument = async (filename: string): Promise<Document> => {
  return await fs
    .readFile(`documents/${filename}`, "utf-8")
    .then((content) => JSON.parse(content) as Document)
    .catch((error) => {
      console.error(`Error reading document ${filename}:`, error);
      throw error;
    });
};
