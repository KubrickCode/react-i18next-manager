import { Service } from "typedi";
import { TranslationRepository } from "./translation.repository";

type TranslationMap = {
  [key in string]: string;
};

type TranslationKeys = {
  [key: string]: TranslationMap;
};

type I18nStructure = {
  keys: {
    [group: string]: TranslationKeys;
  };
};

@Service()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations() {
    const translations = await this.translationRepository.getTranslations();
    const i18n: I18nStructure = {
      keys: {
        common: {
          create: {
            en: translations.en["ui.common.create"] as string,
            ko: translations.ko["ui.common.create"] as string,
          },
          delete: {
            en: translations.en["ui.common.delete"] as string,
            ko: translations.ko["ui.common.delete"] as string,
          },
        },
        error: {
          createError: {
            en: translations.en["ui.error.createError"] as string,
            ko: translations.ko["ui.error.createError"] as string,
          },
          deleteError: {
            en: translations.en["ui.error.deleteError"] as string,
            ko: translations.ko["ui.error.deleteError"] as string,
          },
        },
      },
    };
    return i18n;
  }
}
