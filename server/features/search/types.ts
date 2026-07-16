export type ContentBlock =
  | { type: "heading"; id: string; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string };

export type Document = {
  id: string;
  title: string;
  url: string;
  sections: ContentBlock[];
  bibliography: string[];
};

export type InvertedIndex = Map<string, Map<Document["id"], number>>;

export type SearchResult = {
  id: Document["id"];
  title: string;
  url: string;
  score: number;
};
