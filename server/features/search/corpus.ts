import type { Document } from "./types";
import { getInvertedIndex } from "./utils";
import { getAllDocuments } from "../../db";

export const documents: Document[] = getAllDocuments();

export const invertedIndex = await getInvertedIndex(documents);

export const documentLookup = new Map<Document["id"], Document>(
  documents.map((document) => [document.id, document]),
);
