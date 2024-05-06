import { DBService } from "../db/db.service";
import { Service } from "typedi";
import { EditTranslationBody } from "./translation.controller";

@Service()
export class TranslationRepository {
  constructor(private readonly dbService: DBService) {}

  async getLanguages() {
    return this.dbService.getLanguages();
  }

  async getTranslations() {
    return this.dbService.getTranslations();
  }

  async addTranslation(
    group: string,
    key: string,
    translations: Array<{ language: string; value: string }>
  ) {
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
