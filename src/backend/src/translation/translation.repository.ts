import { DBService } from "../db/db.service";
import { Service } from "typedi";
import { EditTranslationBody } from "./translation.controller";

type AddTranslationParams = {
  group: string;
  key: string;
  translations: {
    language: string;
    value: string;
  }[];
};

@Service()
export class TranslationRepository {
  constructor(private readonly dbService: DBService) {}

  async getLanguages() {
    return this.dbService.getLanguages();
  }

  async getTranslations() {
    return this.dbService.getTranslations();
  }

  async addTranslation({ group, key, translations }: AddTranslationParams) {
    this.dbService.addTranslation(group, key, translations);
  }

  async deleteTranslation(group: string, key: string) {
    this.dbService.deleteTranslation(group, key);
  }

  async editTranslation(group: string, key: string, data: EditTranslationBody) {
    this.dbService.deleteTranslation(group, key);
    this.dbService.addTranslation(group, data.newKey, data.translations);
  }
}
