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
          create: {
            en: translations.en["ui.common.create"],
            ko: translations.ko["ui.common.create"],
          },
          delete: {
            en: translations.en["ui.common.delete"],
            ko: translations.ko["ui.common.delete"],
          },
        },
        error: {
          createError: {
            en: translations.en["ui.error.createError"],
            ko: translations.ko["ui.error.createError"],
          },
          deleteError: {
            en: translations.en["ui.error.deleteError"],
            ko: translations.ko["ui.error.deleteError"],
          },
        },
      },
    };
    return i18n;
  }
}
