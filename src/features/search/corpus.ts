import type { Document } from "@/features/search/types";
import { getInvertedIndex } from "@/features/search/utils";
import { getAllDocuments } from "@/db";

export const documents: Document[] = getAllDocuments();

export const invertedIndex = await getInvertedIndex(documents);

export const documentLookup = new Map<Document["id"], Document>(
  documents.map((document) => [document.id, document]),
);
