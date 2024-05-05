import express, { Application, Request, Response } from "express";
import { Service } from "typedi";
import { Routes } from "./routes";
import path from "path";

@Service()
export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.static(path.join(path.resolve(), "dist")));
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.use("/api", new Routes().router);
    this.app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(path.resolve(), "./dist/index.html"));
    });
  }

  public async startServer(port: number): Promise<void> {
    const server = this.app.listen(port, async () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    process.on("SIGINT", () => {
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    });
  }
}
