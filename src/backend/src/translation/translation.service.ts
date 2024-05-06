import { Service } from "typedi";
import {
  Config,
  TranslationData,
  TranslationRepository,
} from "./translation.repository";

type GroupedTranslations = {
  [group: string]: {
    [key: string]: {
      [language: string]: string;
    };
  };
};

@Service()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations(): Promise<{ keys: GroupedTranslations }> {
    const config = await this.translationRepository.getConfig();
    const rawTranslations = await this.translationRepository.getTranslations();

    const transformTranslations = (
      data: TranslationData,
      config: Config
    ): GroupedTranslations => {
      const { groups, languages } = config;
      const result: GroupedTranslations = {};

      languages.forEach((language) => {
        Object.entries(data[language]).forEach(([key, value]) => {
          const parts = key.split(".");
          const group = parts[1];
          const property = parts[2];

          if (groups.includes(group)) {
            if (!result[group]) result[group] = {};
            if (!result[group][property]) result[group][property] = {};
            result[group][property][language] = value;
          }
        });
      });

      return result;
    };

    const i18n = transformTranslations(rawTranslations, config);

    return { keys: i18n };
  }

  async addTranslation(translation: string) {
    return this.translationRepository.addTranslation(translation);
  }
}
