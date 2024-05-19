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
    return {
      translations: await this.translationRepository.getTranslations({
        groupId,
      }),
    };
  }

  async addTranslation(params: AddTranslationParams) {
    await this.translationRepository.addTranslation(params);
  }

  async editTranslation(params: EditTranslationParams) {
    await this.translationRepository.editTranslation(params);
  }

  async deleteTranslations({ ids }: { ids: UUID[] }) {
    for (const id of ids) {
      if (!this.isUUID(id)) throw new Error('Invalid UUID');
      await this.translationRepository.deleteTranslation({ id });
    }
  }

  private isUUID(id: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
