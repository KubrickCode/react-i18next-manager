import { DBService } from "../db/db.service";
import { Service } from "typedi";

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
export class TranslationRepository {
  constructor(private readonly dbService: DBService) {}

  async getConfig(): Promise<Config> {
    return this.dbService.getConfig();
  }

  async getTranslations(): Promise<TranslationData> {
    return this.dbService.getTranslations();
  }

  async addTranslation(translation: string) {
    console.log("Adding translation: ", translation);
  }
}
