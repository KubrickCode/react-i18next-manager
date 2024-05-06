import { Service } from "typedi";
import { TranslationRepository } from "./translation.repository";

type TranslationData = {
  [key: string]: {
    [subKey: string]: string;
  };
};

@Service()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations() {
    const rawTranslations = await this.translationRepository.getTranslations();

    const transformTranslations = (data: TranslationData) => {
      const result: { [group: string]: { [key: string]: any } } = {};
      Object.keys(data).forEach((language) => {
        Object.keys(data[language]).forEach((key) => {
          const group = key.split(".")[1];
          const property = key.split(".")[2];

          if (!result[group]) result[group] = {};
          if (!result[group][property]) result[group][property] = {};

          result[group][property][language] = data[language][key];
        });
      });
      return result;
    };

    const i18n = transformTranslations(rawTranslations);

    return { keys: i18n };
  }

  async addTranslation(translation: string) {
    return this.translationRepository.addTranslation(translation);
  }
}
