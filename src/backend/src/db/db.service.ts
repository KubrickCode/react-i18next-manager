import { Service } from "typedi";
import fs from "fs";
import path from "path";

export type TranslationData = {
  [language: string]: {
    [key: string]: string;
  };
};

export type Config = {
  groups: string[];
  languages: string[];
};

@Service()
export class DBService {
  private config: Config = {
    groups: [],
    languages: [],
  };
  private data: TranslationData = {};

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

  public getGroups() {
    return this.config.groups;
  }

  public getLanguages() {
    return this.config.languages;
  }

  public getTranslations() {
    return this.data;
  }
}
