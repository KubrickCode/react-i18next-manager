import { DBService } from "../db/db.service";
import { Service } from "typedi";

@Service()
export class TranslationRepository {
  constructor(private readonly dbService: DBService) {}

  async getTranslations() {
    return this.dbService.getTranslations();
  }
}
