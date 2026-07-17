import { Router } from "express";
import type { Response } from "express";

import { search } from "@/features/search/utils";
import { invertedIndex, documentLookup } from "@/features/search/corpus";
import type { SearchResult } from "@/features/search/types";

const searchPageRouter: Router = Router();

const getResults = (searchTerm: string): SearchResult[] =>
  searchTerm ? search(searchTerm, invertedIndex, documentLookup, 10) : [];

const renderSearchPage = (searchTerm: string, res: Response) => {
  res.render("search-template", {
    searchTerm,
    results: getResults(searchTerm),
  });
};

searchPageRouter.get("/", (_req, res) => renderSearchPage("", res));

searchPageRouter.get("/search", (req, res) => {
  const { q } = req.query as { q?: string };
  renderSearchPage(q ?? "", res);
});

// Fragment endpoint: renders just the results list, for the input's live
// fetch-on-type handler to swap in without a full page reload.
searchPageRouter.get("/search/results", (req, res) => {
  const { q } = req.query as { q?: string };
  const searchTerm = q ?? "";
  res.render("search-results", { searchTerm, results: getResults(searchTerm) });
});

export default searchPageRouter;
