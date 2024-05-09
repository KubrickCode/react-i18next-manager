import { Service } from "typedi";
import { TranslationRepository } from "./translation.repository";
import { EditTranslationBody } from "./translation.controller";

type GetTranslationsParams = {
  group: string;
  skip: number;
  take: number;
};

type AddTranslationParams = {
  group: string;
  key: string;
  translations: {
    language: string;
    value: string;
  }[];
};

type Translations = {
  [key: string]: {
    [language: string]: string;
  };
};

type RawTranslationData = {
  [language: string]: {
    [key: string]: string;
  };
};

@Service()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations({ group, skip, take }: GetTranslationsParams) {
    const languages = await this.translationRepository.getLanguages();
    const rawTranslations = await this.translationRepository.getTranslations();

    const transformTranslations = (
      data: RawTranslationData,
      languages: string[]
    ): Translations => {
      const result: Translations = {};

      languages.forEach((language) => {
        if (!data[language]) return;

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

    const translations = transformTranslations(rawTranslations, languages);
    const count = Object.keys(translations).length;
    const hasPrevPage = skip > 0;
    const hasNextPage = skip + take < count;

    return { translations, count, hasPrevPage, hasNextPage };
  }

  async addTranslation(params: AddTranslationParams) {
    await this.translationRepository.addTranslation(params);
  }

  async deleteTranslation(group: string, key: string) {
    await this.translationRepository.deleteTranslation(group, key);
  }

  async editTranslation(group: string, key: string, data: EditTranslationBody) {
    return this.translationRepository.editTranslation(group, key, data);
  }
}
