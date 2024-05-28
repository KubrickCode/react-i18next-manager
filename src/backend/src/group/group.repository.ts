import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DBService, DB, DBSchema, GroupSchema } from 'src/db/db.service';

type CreateParams = {
  label: string;
  parentId: UUID | null;
};

type UpdateLabelParams = {
  id: UUID;
  newLabel: string;
};

type UpdatePositionParams = {
  id: UUID;
  position: number;
};

@Injectable()
export class GroupRepository {
  private db: DB;

  constructor(private readonly dbService: DBService) {
    this.initializeDb();
  }

  private async initializeDb() {
    this.db = await this.dbService.get();
  }

  async findMany() {
    return this.db.get('groups').value();
  }

  async findManyByParentId({ parentId }: { parentId: UUID | null }) {
    const groups = this.db.get('groups').value();
    return groups.filter((group) => group.parentId === parentId);
  }

  async create({ label, parentId }: CreateParams) {
    const groups = this.db.get('groups').value();
    const newGroup: GroupSchema = {
      id: generateUUID(),
      parentId,
      label,
      position: 0,
    };

    if (parentId) {
      const parentGroup = this.findById({ id: parentId });
      newGroup.position = parentGroup.children.length;
      parentGroup.children.push(newGroup);
    } else {
      newGroup.position = groups.length;
      groups.push(newGroup);
    }

    this.db.write();
  }

  async updateLabel({ id, newLabel }: UpdateLabelParams) {
    const groups = this.db.get('groups').value();
    const group = this.findById({ id });

    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    const parentGroup = this.findParentById({ id });
    const siblings = parentGroup ? parentGroup.children : groups;

    this.checkDuplicateLabel(siblings, newLabel, id);

    this.checkDuplicateLabelInTranslations(
      parentGroup ? parentGroup.id : null,
      newLabel,
    );

    group.label = newLabel;
    this.db.write();
  }

  async updatePosition({ id, position }: UpdatePositionParams) {
    const groups = this.db.get('groups').value();
    const group = this.findById({ id });

    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    const parentGroup = this.findParentById({ id });

    if (parentGroup) {
      this.reorder(parentGroup.children, id, position);
    } else {
      this.reorder(groups, id, position);
    }

    this.db.write();
  }

  async delete({ id }: { id: UUID }) {
    const groups = this.db.get('groups').value();
    const allGroupIds = this.collectGroupAndChildIds(id);
    this.findAndDelete({ id, groups });

    const translations = this.db.get('translations').value();
    const updatedTranslations = translations.filter(
      (translation) => !allGroupIds.includes(translation.groupId),
    );
    this.db.set('translations', updatedTranslations).write();
  }

  private checkDuplicateLabel(
    groups: GroupSchema[],
    label: string,
    excludeId?: UUID,
  ) {
    if (
      groups.some((group) => group.label === label && group.id !== excludeId)
    ) {
      throw new ConflictException(
        `Group with label "${label}" already exists.`,
      );
    }
  }

  private checkDuplicateLabelInTranslations(
    parentId: UUID | null,
    label: string,
  ) {
    const translations = this.db.get('translations').value();
    const duplicateTranslation = translations.some((translation) => {
      return translation.groupId === parentId && translation.key === label;
    });

    if (duplicateTranslation) {
      throw new ConflictException(
        `Translation with key "${label}" already exists in the parent group.`,
      );
    }
  }

  private collectGroupAndChildIds(id: UUID) {
    const groupIds: UUID[] = [];
    const collect = (group: GroupSchema) => {
      groupIds.push(group.id);
      if (group.children) {
        group.children.forEach(collect);
      }
    };

    const targetGroup = this.findById({ id });
    if (targetGroup) {
      collect(targetGroup);
    }

    return groupIds;
  }

  private findById({ id }: { id: UUID }) {
    const groups = this.db.get('groups').value();

    for (const group of groups) {
      if (group.id === id) return group;
      const found = this.findById({ id: group.id });
      if (found) return found;
    }
    return null;
  }

  private findAndDelete({
    id,
    groups,
  }: {
    id: UUID;
    groups: DBSchema['groups'];
  }) {
    const index = groups.findIndex((group) => group.id === id);

    if (index !== -1) {
      groups.splice(index, 1);
      return;
    }

    for (const group of groups) {
      if (group.children) {
        this.findAndDelete({
          id,
          groups: group.children,
        });
      }
    }
  }

  private findParentById({ groups, id }: { groups?: GroupSchema[]; id: UUID }) {
    return this.findParentById({
      groups: groups ?? this.db.get('groups').value(),
      id,
    });
  }

  private reorder(groups: GroupSchema[], id: UUID, newPosition: number) {
    const groupIndex = groups.findIndex((group) => group.id === id);

    if (groupIndex === -1) {
      throw new NotFoundException(
        `Group with id ${id} not found in the given group list`,
      );
    }

    const [movedGroup] = groups.splice(groupIndex, 1);
    groups.splice(newPosition, 0, movedGroup);

    groups.forEach((group, index) => {
      group.position = index;
    });
  }
}
