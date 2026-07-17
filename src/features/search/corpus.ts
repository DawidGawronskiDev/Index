import type { Document } from "@/features/search/types";
import {
  getInvertedIndex,
  loadIndexCache,
  saveIndexCache,
} from "@/features/search/utils";
import { getAllDocuments } from "@/db";

export const documents: Document[] = getAllDocuments();

const cached = loadIndexCache();

export const { invertedIndex, documentLengths, averageDocumentLength } =
  cached ?? (await getInvertedIndex(documents));

if (!cached) {
  saveIndexCache({ invertedIndex, documentLengths, averageDocumentLength });
}

export const documentLookup = new Map<Document["id"], Document>(
  documents.map((document) => [document.id, document]),
);
