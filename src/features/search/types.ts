export type Document = {
  id: number;
  title: string;
  url: string;
};

export type InvertedIndex = Map<string, Map<Document["id"], number>>;

export type SearchResult = {
  id: Document["id"];
  title: string;
  url: string;
  score: number;
};
