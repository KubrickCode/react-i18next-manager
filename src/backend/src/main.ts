#!/usr/bin/env node

import express, { Request, Response } from "express";
import path from "path";
import open from "open";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "./")));
app.use(express.json());

app.get("/api/hello", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  open(`http://localhost:${port}`);
});
