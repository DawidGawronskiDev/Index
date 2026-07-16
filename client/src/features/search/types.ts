export type SearchResult = {
  id: string;
  title: string;
  url: string;
  score: number;
};

export type ContentBlock =
  | { type: "heading"; id: string; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string };

export type Article = {
  id: string;
  title: string;
  url: string;
  sections: ContentBlock[];
  bibliography: string[];
};
