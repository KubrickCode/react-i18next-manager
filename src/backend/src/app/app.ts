import express, { Application, Request, Response } from "express";
import { Service } from "typedi";
import { Routes } from "./routes";
import path from "path";
import fs from "fs";

@Service()
export class App {
  public app: Application;
  private targetPath: string;

  constructor() {
    this.app = express();
    this.targetPath = this.setupTargetPath();
    this.setupDB();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupDB(): void {
    const existsTargetPathFolder = fs.existsSync(this.targetPath);
    if (!existsTargetPathFolder) {
      fs.mkdirSync(this.targetPath);
    }

    const configFileExists = fs.existsSync(
      path.join(this.targetPath, "config.json")
    );
    if (!configFileExists) {
      fs.writeFileSync(
        path.join(this.targetPath, "config.json"),
        JSON.stringify({ groups: [], languages: [] })
      );
    }

    const resourceFileExists = fs.existsSync(
      path.join(this.targetPath, "i18n.json")
    );
    if (!resourceFileExists) {
      fs.writeFileSync(path.join(this.targetPath, "i18n.json"), "{}");
    }
  }

  private setupTargetPath(): string {
    const configFilePath = path.join("./", "i18n-config.json");
    if (!fs.existsSync(configFilePath)) {
      throw new Error(
        "i18n-config.json file not found in the root directory. You can create a file with the init command."
      );
    }
    const configFile = fs.readFileSync(configFilePath, "utf8");
    try {
      const { targetPath } = JSON.parse(configFile);
      if (!targetPath) {
        throw new Error("targetPath is required in i18n-config.json file.");
      }
      return targetPath;
    } catch (error) {
      throw error;
    }
  }

  private setupMiddleware(): void {
    this.app.use(express.static(path.join(__dirname, "../")));
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.use("/api", new Routes().router);
    this.app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "index.html"));
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
