import path from "path";
import express, { type Express } from "express";
import cors from "cors";

import searchRouter from "@/routes/search-route";
import healthRouter from "@/routes/health-route";
import searchPageRouter from "@/routes/search-page-route";

import "dotenv/config";

const app: Express = express();

app.set("view engine", "pug");
app.set("views", path.join(import.meta.dirname, "templates"));

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(
  cors({
    origin: "*",
  }),
);

app.use("/api/health", healthRouter);
app.use("/api/search", searchRouter);

app.use("/", searchPageRouter);

export default app;
