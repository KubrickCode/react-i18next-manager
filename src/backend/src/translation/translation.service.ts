import { ConflictException, Injectable } from '@nestjs/common';
import { TranslationRepository } from './translation.repository';
import { UUID } from 'src/common/types';
import { GroupRepository } from 'src/group/group.repository';

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
  constructor(
    private readonly translationRepository: TranslationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async getAll({ groupId }: { groupId: UUID }) {
    return {
      translations: await this.translationRepository.findManyByGroupId({
        groupId,
      }),
    };
  }

  async add({ groupId, key, values }: AddParams) {
    await this.checkExistingKey({ groupId, key });

    await this.translationRepository.create({
      groupId,
      key,
      values,
    });
  }

  async edit({ id, newKey, newValues }: EditParams) {
    const translation = await this.translationRepository.findById({ id });

    await this.checkExistingKey({
      excludeId: id,
      groupId: translation.groupId,
      key: newKey,
    });

    await this.translationRepository.update({ id, newKey, newValues });
  }

  async editManyParentGroup({
    translations,
    newGroupId,
  }: {
    translations: { id: UUID }[];
    newGroupId: UUID;
  }) {
    const promises = translations.map(async ({ id }) => {
      const translation = await this.translationRepository.findById({ id });

      await this.checkExistingKey({
        excludeId: id,
        groupId: newGroupId,
        key: translation.key,
      });

      await this.translationRepository.update({ id, newGroupId });
    });

    await Promise.all(promises);
  }

  async deleteMany({ translations }: { translations: { id: UUID }[] }) {
    await this.translationRepository.deleteMany({
      ids: translations.map((t) => t.id),
    });
  }

  private async checkExistingKey({
    excludeId,
    groupId,
    key,
  }: {
    excludeId?: UUID;
    groupId: UUID;
    key: string;
  }) {
    const translations = await this.translationRepository.findManyByGroupId({
      groupId,
    });
    if (translations.some((t) => t.key === key && t.id !== excludeId)) {
      throw new ConflictException(
        `Translation key "${key}" already exists in the group "${groupId}".`,
      );
    }

    const groups = await this.groupRepository.findManyByParentId({
      parentId: groupId,
    });
    if (groups.some((g) => g.label === key)) {
      throw new ConflictException(
        `Translation key "${key}" already exists as a group label in the group "${groupId}".`,
      );
    }
  }
}
