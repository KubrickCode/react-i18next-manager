import { Injectable } from '@nestjs/common';
import { TranslationRepository } from './translation.repository';
import { UUID } from 'src/common/types';

type AddTranslationParams = {
  groupId: UUID;
  key: string;
  values: {
    localeId: UUID;
    value: string;
  }[];
};

type EditTranslationParams = {
  id: UUID;
  newKey: string;
  newValues: {
    localeId: UUID;
    value: string;
  }[];
};

@Injectable()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations({ groupId }: { groupId: UUID }) {
    return this.translationRepository.getTranslations({ groupId });
  }

  async addTranslation(params: AddTranslationParams) {
    await this.translationRepository.addTranslation(params);
  }

  async editTranslation(params: EditTranslationParams) {
    await this.translationRepository.editTranslation(params);
  }

  async deleteTranslation({ id }: { id: UUID }) {
    await this.translationRepository.deleteTranslation({ id });
  }
}
