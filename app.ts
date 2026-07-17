import express, { type Express } from "express";
import cors from "cors";

import searchRouter from "./routes/search-route";
import healthRouter from "./routes/health-route";
import articleRouter from "./routes/article-route";
import searchPageRouter from "./routes/search-page-route";

import "dotenv/config";

const app: Express = express();

app.set("view engine", "pug");
app.set("views", "./templates");

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

app.use("/", searchPageRouter);

export default app;
