import { Router } from "express";
import type { Request, Response } from "express";

const healthRouter: Router = Router();

healthRouter.get("/", (_: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default healthRouter;
