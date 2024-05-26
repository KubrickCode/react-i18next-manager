import { Injectable } from '@nestjs/common';
import { TranslationRepository } from './translation.repository';
import { UUID } from 'src/common/types';

type AddParams = {
  groupId: UUID;
  key: string;
  values: {
    localeId: UUID;
    value: string;
  }[];
};

type EditParams = {
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

  async getAll({ groupId }: { groupId: UUID }) {
    return {
      translations: await this.translationRepository.findManyByGroupId({
        groupId,
      }),
    };
  }

  async add(params: AddParams) {
    await this.translationRepository.create(params);
  }

  async edit(params: EditParams) {
    await this.translationRepository.update(params);
  }

  async deleteMany({ translations }: { translations: { id: UUID }[] }) {
    for (const { id } of translations) {
      await this.translationRepository.delete({ id });
    }
  }
}
