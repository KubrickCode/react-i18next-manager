import { Service } from "typedi";

@Service()
export class TranslationRepository {
  constructor() {}

  async getTranslations() {
    return "Hello, World!";
  }
}
