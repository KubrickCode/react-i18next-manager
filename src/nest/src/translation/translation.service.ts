import { Injectable } from '@nestjs/common';
import { TranslationRepository } from './translation.repository';
import { UUID } from 'src/common/types';

type AddTranslationsParams = {
  groupId: UUID;
  newTranslations: {
    localeId: UUID;
    key: string;
    value: string;
  }[];
};

type EditTranslationsParams = {
  newTranslations: {
    id: UUID;
    value: string;
  }[];
};

@Injectable()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations({ groupId }: { groupId: UUID }) {
    return this.translationRepository.getTranslations({ groupId });
  }

  async addTranslations({ groupId, newTranslations }: AddTranslationsParams) {
    for (const newTranslation of newTranslations) {
      await this.translationRepository.addTranslation({
        groupId,
        ...newTranslation,
      });
    }
  }

  async editTranslations({ newTranslations }: EditTranslationsParams) {
    for (const newTranslation of newTranslations) {
      await this.translationRepository.editTranslation(newTranslation);
    }
  }

  async deleteTranslations({ ids }: { ids: UUID[] }) {
    for (const id of ids) {
      await this.translationRepository.deleteTranslation({ id });
    }
  }
}
