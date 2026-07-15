import type { Document } from "./types";
import { getDocumentFilenames, getInvertedIndex, readDocument } from "./utils";

const documentFilenames = await getDocumentFilenames();

export const documents: Document[] = await Promise.all(
  documentFilenames.map((filename) => readDocument(filename)),
);

export const invertedIndex = await getInvertedIndex(documents);

export const documentLookup = new Map<Document["id"], Document>(
  documents.map((document) => [document.id, document]),
);
