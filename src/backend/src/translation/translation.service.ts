import { Service } from "typedi";
import { TranslationRepository } from "./translation.repository";

@Service()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations() {
    const translations = await this.translationRepository.getTranslations();
    const i18n = {
      keys: {
        common: {
          en: {
            create: translations.en["ui.common.create"],
            delete: translations.en["ui.common.delete"],
          },
          ko: {
            create: translations.ko["ui.common.create"],
            delete: translations.ko["ui.common.delete"],
          },
        },
        error: {
          en: {
            createError: translations.en["ui.error.createError"],
            deleteError: translations.en["ui.error.deleteError"],
          },
          ko: {
            createError: translations.ko["ui.error.createError"],
            deleteError: translations.ko["ui.error.deleteError"],
          },
        },
      },
    };
    return i18n;
  }
}
