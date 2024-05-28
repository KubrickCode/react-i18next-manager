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

    const siblings = await this.findManyByParentId({ parentId });

    newGroup.position = siblings.length;
    groups.push(newGroup);

    this.db.write();
  }

  async updateLabel({ id, newLabel }: UpdateLabelParams) {
    const group = await this.findById({ id });

    group.label = newLabel;
    this.db.write();
  }

  async updatePosition({ id, position }: UpdatePositionParams) {
    const group = await this.findById({ id });

    group.position = position;

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

  async findById({ id }: { id: UUID }) {
    const groups = this.db.get('groups').value();
    return groups.find((group) => group.id === id);
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
}
