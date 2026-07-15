import express, { type Express } from "express";
import cors from "cors";

import searchRouter from "./routes/search-route";
import healthRouter from "./routes/health-route";
import articleRouter from "./routes/article-route";

import "dotenv/config";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use("/api/health", healthRouter);
app.use("/api/search", searchRouter);
app.use("/api/articles", articleRouter);

export default app;
