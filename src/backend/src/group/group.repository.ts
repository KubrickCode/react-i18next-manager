import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DBService, DB, GroupSchema } from 'src/db/db.service';

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

  async findById({ id }: { id: UUID }) {
    const groups = this.db.get('groups').value();
    return groups.find((group) => group.id === id);
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

  async deleteMany({ ids }: { ids: UUID[] }) {
    const groups = this.db.get('groups').value();
    const remainingGroups = groups.filter((group) => !ids.includes(group.id));
    this.db.set('groups', remainingGroups).write();
  }
}
