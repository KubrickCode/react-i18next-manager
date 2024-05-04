import { Service } from "typedi";
import { TranslationRepository } from "./translation.repository";

@Service()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations() {
    return await this.translationRepository.getTranslations();
  }
}
