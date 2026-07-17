import Database from "better-sqlite3";
import type { Document } from "../features/search/types";

const db = new Database("search_engine.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    sections TEXT NOT NULL,
    bibliography TEXT NOT NULL
  )
`);

type DocumentRow = {
  id: string;
  url: string;
  title: string;
  sections: string;
  bibliography: string;
};

const rowToDocument = (row: DocumentRow): Document => ({
  id: row.id,
  title: row.title,
  url: row.url,
  sections: JSON.parse(row.sections),
  bibliography: JSON.parse(row.bibliography),
});

export const getAllDocuments = (): Document[] => {
  const rows = db.prepare("SELECT * FROM documents").all() as DocumentRow[];
  return rows.map(rowToDocument);
};

export const getDocumentById = (id: string): Document | undefined => {
  const row = db
    .prepare("SELECT * FROM documents WHERE id = ?")
    .get(id) as DocumentRow | undefined;
  return row ? rowToDocument(row) : undefined;
};

const upsertStatement = db.prepare(`
  INSERT INTO documents (id, title, url, sections, bibliography)
  VALUES (@id, @title, @url, @sections, @bibliography)
  ON CONFLICT(url) DO UPDATE SET
    title = excluded.title,
    sections = excluded.sections,
    bibliography = excluded.bibliography
`);

export const upsertDocument = (document: Document): void => {
  upsertStatement.run({
    id: document.id,
    title: document.title,
    url: document.url,
    sections: JSON.stringify(document.sections),
    bibliography: JSON.stringify(document.bibliography),
  });
};
