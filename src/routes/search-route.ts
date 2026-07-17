import { Router } from "express";

import { search } from "@/features/search/utils";
import { invertedIndex, documentLookup } from "@/features/search/corpus";

const searchRouter: Router = Router();

searchRouter.get("/", (req, res) => {
  const { q } = req.query as { q: string };

  const searchResults = search(q, invertedIndex, documentLookup, 10);
  res.status(200).json(searchResults);
});

export default searchRouter;
