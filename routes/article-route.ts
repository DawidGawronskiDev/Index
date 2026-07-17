import { Router } from "express";

import { documentLookup } from "../features/search/corpus";

const articleRouter: Router = Router();

articleRouter.get("/:id", (req, res) => {
  const article = documentLookup.get(req.params.id);

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.status(200).json(article);
});

export default articleRouter;
