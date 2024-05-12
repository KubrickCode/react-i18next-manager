import { Service } from "typedi";
import fs from "fs";
import path from "path";

export type TranslationData = {
  [language: string]: {
    [key: string]: string;
  };
};

export type Config = {
  groups: Group[];
  languages: string[];
};

export type Group = {
  key: string;
  children?: Group[];
};

@Service()
export class DBService {
  private config: Config = {
    groups: [],
    languages: [],
  };
  private data: TranslationData = {};
  private resourcePath: string;
  private configPath: string;

  constructor() {
    const targetPath = this.getTargetPath();
    this.resourcePath = targetPath + "/i18n.json";
    this.configPath = targetPath + "/config.json";
    this.loadConfig();
    this.loadData();
  }

  private getTargetPath() {
    const i18nConfigFilePath = path.join("./", "i18n-config.json");
    const i18nConfigFile = fs.readFileSync(i18nConfigFilePath, "utf8");
    const { targetPath } = JSON.parse(i18nConfigFile);
    return targetPath;
  }

  private loadConfig() {
    const configFile = fs.readFileSync(this.configPath, "utf8");
    this.config = JSON.parse(configFile);
  }

  private loadData() {
    const fileContent = fs.readFileSync(this.resourcePath, "utf8");
    this.data = JSON.parse(fileContent);
  }

  private saveData() {
    const sortedData: TranslationData = {};
    this.config.languages.forEach((language) => {
      sortedData[language] = this.sortObjectKeys(this.data[language]);
    });

    fs.writeFileSync(this.resourcePath, JSON.stringify(sortedData, null, 2));
  }

  private sortObjectKeys(obj: { [key: string]: string }): {
    [key: string]: string;
  } {
    const sortedKeys = Object.keys(obj).sort();
    const result: { [key: string]: string } = {};
    sortedKeys.forEach((key) => {
      result[key] = obj[key];
    });
    return result;
  }

  getGroups() {
    return this.config.groups;
  }

  getLanguages() {
    return this.config.languages;
  }

  getTranslations() {
    return this.data;
  }

  addTranslation(
    group: string,
    key: string,
    translations: Array<{ language: string; value: string }>
  ) {
    translations.forEach(({ language, value }) => {
      if (!this.data[language]) {
        this.data[language] = {};
      }
      this.data[language][`ui.${group}.${key}`] = value;
    });
    this.saveData();
  }

  deleteTranslation(group: string, key: string) {
    const fullKey = `ui.${group}.${key}`;
    this.config.languages.forEach((language) => {
      if (this.data[language] && this.data[language][fullKey]) {
        delete this.data[language][fullKey];
      }
    });
    this.saveData();
  }

  saveGroups(groups: Group[]): Promise<void> {
    this.config.groups = groups;

    const data = JSON.stringify(this.config, null, 2);
    fs.writeFileSync(this.configPath, data);
    return Promise.resolve();
  }

  saveLanguages(languages: string[]): Promise<void> {
    this.config.languages = languages;

    const data = JSON.stringify(this.config, null, 2);
    fs.writeFileSync(this.configPath, data);
    return Promise.resolve();
  }
}
