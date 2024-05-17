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

@Injectable()
export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async getTranslations({ groupId }: { groupId: UUID }) {
    return this.translationRepository.getTranslations({ groupId });
  }

  async addTranslations(params: AddTranslationsParams) {
    return this.translationRepository.addTranslations(params);
  }
}
