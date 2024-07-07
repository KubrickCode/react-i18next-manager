import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DBAdapter } from 'src/db/db.adapter';
import { DBService } from 'src/db/db.service';

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
  parentId: UUID | null;
  position: number;
};

@Injectable()
export class GroupRepository extends DBAdapter {
  constructor(protected readonly dbService: DBService) {
    super(dbService);
  }

  async findById({ id }: { id: UUID }) {
    return this.db.get('groups').find({ id }).value();
  }

  async findMany() {
    return this.db.get('groups').value();
  }

  async findManyByParentId({ parentId }: { parentId: UUID | null }) {
    return this.db.get('groups').filter({ parentId }).value();
  }

  async create({ label, parentId }: CreateParams) {
    const siblings = await this.findManyByParentId({ parentId });

    this.db
      .get('groups')
      .push({
        id: generateUUID(),
        parentId,
        label,
        position: siblings.length,
      })
      .write();
  }

  async updateLabel({ id, newLabel }: UpdateLabelParams) {
    this.db.get('groups').find({ id }).assign({ label: newLabel }).write();
  }

  async updatePosition({ id, parentId, position }: UpdatePositionParams) {
    this.db.get('groups').find({ id }).assign({ parentId, position }).write();
  }

  async deleteMany({ ids }: { ids: UUID[] }) {
    this.db
      .get('groups')
      .remove((group) => ids.includes(group.id))
      .write();
    this.db
      .get('translations')
      .remove((translation) => ids.includes(translation.groupId))
      .write();
  }
}
