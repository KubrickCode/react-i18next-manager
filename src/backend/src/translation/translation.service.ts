import { Service } from "typedi";
import { TranslationRepository } from "./translation.repository";
import { TranslationData } from "../db/db.service";
import {
  AddTranslationBody,
  EditTranslationBody,
} from "./translation.controller";

type Translations = {
  [key: string]: {
    [language: string]: string;
  };
};

@Service()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations(
    group: string,
    skip: number,
    take: number
  ): Promise<{
    keys: Translations;
    count: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  }> {
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

      const sortedProperties = Object.keys(result)
        .sort()
        .slice(skip, skip + take);
      const paginatedResult: Translations = {};

      sortedProperties.forEach((property) => {
        paginatedResult[property] = result[property];
      });

      return paginatedResult;
    };

    const i18n = transformTranslations(rawTranslations, languages);
    const count = Object.keys(i18n).length;
    const hasPrevPage = skip > 0;
    const hasNextPage = skip + take < count;

    return { keys: i18n, count, hasPrevPage, hasNextPage };
  }

  async addTranslation(group: string, data: AddTranslationBody) {
    const { key, translations } = data;
    await this.translationRepository.addTranslation(group, key, translations);
  }

  async deleteTranslation(group: string, key: string) {
    await this.translationRepository.deleteTranslation(group, key);
  }

  async editTranslation(group: string, key: string, data: EditTranslationBody) {
    return this.translationRepository.editTranslation(group, key, data);
  }
}
