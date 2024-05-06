import { Service } from "typedi";
import fs from "fs";
import path from "path";

@Service()
export class DBService {
  private config: any;
  private data: any;

  constructor() {
    this.loadConfig();
    this.loadData();
  }

  private loadConfig() {
    const configPath = path.join(__dirname, "../../sample/config.json");
    const configFile = fs.readFileSync(configPath, "utf8");
    this.config = JSON.parse(configFile);
  }

  private loadData() {
    const filePath = path.join(__dirname, "../../sample/i18n.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    this.data = JSON.parse(fileContent);
  }

  public getConfig() {
    return this.config;
  }

  public getTranslations() {
    return this.data;
  }
}
