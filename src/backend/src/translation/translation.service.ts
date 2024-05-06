import { Service } from "typedi";
import { TranslationRepository } from "./translation.repository";
import { TranslationData } from "../db/db.service";

type Translations = {
  [key: string]: {
    [language: string]: string;
  };
};

@Service()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations(group: string): Promise<{ keys: Translations }> {
    const languages = await this.translationRepository.getLanguages();
    const rawTranslations = await this.translationRepository.getTranslations();

    const transformTranslations = (
      data: TranslationData,
      languages: string[]
    ): Translations => {
      const result: Translations = {};

      languages.forEach((language) => {
        Object.entries(data[language]).forEach(([key, value]) => {
          const [_, grp, property] = key.split(".");
          if (grp === group) {
            if (!result[property]) {
              result[property] = {};
            }
            result[property][language] = value;
          }
        });
      });

      return result;
    };

    const i18n = transformTranslations(rawTranslations, languages);

    return { keys: i18n };
  }

  async addTranslation(translation: string) {
    return this.translationRepository.addTranslation(translation);
  }
}
