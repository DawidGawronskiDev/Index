import Database from "better-sqlite3";
import type { Document } from "@/features/search/types";

const db = new Database("search_engine.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL
  );
`);

type DocumentRow = {
  id: number;
  url: string;
  title: string;
  content: string;
};

const rowToDocument = ({ id, title, url, content }: DocumentRow): Document => ({
  id,
  title,
  url,
  content,
});

export const getAllDocuments = (): Document[] => {
  const rows = db.prepare("SELECT * FROM documents").all() as DocumentRow[];
  return rows.map(rowToDocument);
};

const upsertStatement = db.prepare(`
  INSERT INTO documents (title, url, content)
  VALUES (@title, @url, @content)
  ON CONFLICT(title) DO UPDATE SET
    url = excluded.url,
    content = excluded.content
`);

export const upsertDocument = (document: Omit<Document, "id">): void => {
  upsertStatement.run({
    title: document.title,
    url: document.url,
    content: document.content,
  });
};
