import { ConflictException, Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { UUID } from 'src/common/types';
import { TranslationRepository } from 'src/translation/translation.repository';
import { GroupSchema } from 'src/db/db.schema';

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

  async editPosition({ id, position }: EditPositionParams) {
    const group = await this.groupRepository.findById({ id });

    const siblings = await this.groupRepository.findManyByParentId({
      parentId: group.parentId,
    });

    const reorderedSiblings = this.reorderSiblings(siblings, id, position);

    for (const { id, position } of reorderedSiblings) {
      await this.groupRepository.updatePosition({
        id,
        position,
      });
    }
  }

  async editLabel(params: EditLabelParams) {
    return await this.groupRepository.updateLabel(params);
  }

  async delete({ id }: { id: UUID }) {
    return await this.groupRepository.delete({ id });
  }

  private reorderSiblings(
    groups: GroupSchema[],
    id: UUID,
    newPosition: number,
  ): GroupSchema[] {
    const groupIndex = groups.findIndex((group) => group.id === id);

    const [movedGroup] = groups.splice(groupIndex, 1);
    groups.splice(newPosition, 0, movedGroup);

    return groups.map((group, index) => {
      group.position = index;
      return group;
    });
  }
}
