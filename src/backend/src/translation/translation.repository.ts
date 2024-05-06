import { DBService } from "../db/db.service";
import { Service } from "typedi";

@Service()
export class TranslationRepository {
  constructor(private readonly dbService: DBService) {}

  async getLanguages() {
    return this.dbService.getLanguages();
  }

  async getTranslations() {
    return this.dbService.getTranslations();
  }

  async addTranslation(translation: string) {
    console.log("Adding translation: ", translation);
  }
}
