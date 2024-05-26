import { ConflictException, Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { UUID } from 'src/common/types';
import { TranslationRepository } from 'src/translation/translation.repository';

type AddParams = {
  label: string;
  parentId: UUID | null;
};

type EditLabelParams = {
  id: UUID;
  newLabel: string;
};

type EditPositionParams = {
  id: UUID;
  position: number;
};

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly translationRepository: TranslationRepository,
  ) {}

  async getAll() {
    return { groups: await this.groupRepository.findMany() };
  }

  async add({ label, parentId }: AddParams) {
    const groups = await this.groupRepository.findManyByParentId({ parentId });
    const existsInParent = groups.some((group) => group.label === label);
    if (existsInParent) {
      throw new ConflictException(
        `Group with label "${label}" already exists in parent`,
      );
    }

    if (parentId) {
      const translations = await this.translationRepository.findManyByGroupId({
        groupId: parentId,
      });
      const existsInParentTranslations = translations.some(
        (translation) => translation.key === label,
      );
      if (existsInParentTranslations) {
        throw new ConflictException(
          `Translation with key "${label}" already exists in parent`,
        );
      }
    }

    return await this.groupRepository.create({ label, parentId });
  }

  async editPosition(params: EditPositionParams) {
    return await this.groupRepository.updatePosition(params);
  }

  async editLabel(params: EditLabelParams) {
    return await this.groupRepository.updateLabel(params);
  }

  async delete({ id }: { id: UUID }) {
    return await this.groupRepository.delete({ id });
  }
}
