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
  parentId: UUID | null;
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
    await this.checkExistingLabel({ label, parentId });

    return await this.groupRepository.create({ label, parentId });
  }

  async editLabel({ id, newLabel }: EditLabelParams) {
    const group = await this.groupRepository.findById({ id });

    await this.checkExistingLabel({
      label: newLabel,
      parentId: group.parentId,
    });

    return await this.groupRepository.updateLabel({ id, newLabel });
  }

  async editPosition({ id, parentId, position }: EditPositionParams) {
    const siblings = await this.groupRepository.findManyByParentId({
      parentId,
    });

    const reorderedSiblings = this.reorderSiblings(siblings, id, position);

    for (const { id, position } of reorderedSiblings) {
      await this.groupRepository.updatePosition({
        id,
        parentId,
        position,
      });
    }
  }

  async delete({ id }: { id: UUID }) {
    const allGroupIds = await this.collectAllGroupIds(id);

    await this.groupRepository.deleteMany({ ids: allGroupIds });
  }

  private async checkExistingLabel({
    label,
    parentId,
  }: {
    label: string;
    parentId: UUID | null;
  }) {
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
  }

  private async collectAllGroupIds(parentId: UUID): Promise<UUID[]> {
    const children = await this.groupRepository.findManyByParentId({
      parentId,
    });

    const ids = [parentId];
    for (const child of children) {
      ids.push(...(await this.collectAllGroupIds(child.id)));
    }

    return ids;
  }

  private reorderSiblings(
    groups: GroupSchema[],
    id: UUID,
    newPosition: number,
  ): GroupSchema[] {
    const currentGroup = groups.find((group) => group.id === id);

    const remainingGroups = currentGroup
      ? groups.filter((group) => group.id !== id)
      : groups;

    const updatedGroups = remainingGroups.map((group) => {
      if (group.position >= newPosition) {
        return {
          ...group,
          position: group.position + 1,
        };
      }
      return group;
    });

    const newGroup = currentGroup || {
      id,
      position: newPosition,
      parentId: null,
      label: '',
    };

    newGroup.position = newPosition;

    const reorderedGroups = [...updatedGroups, newGroup].sort(
      (a, b) => a.position - b.position,
    );

    return reorderedGroups.map((group, index) => ({
      ...group,
      position: index,
    }));
  }
}
