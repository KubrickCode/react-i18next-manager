import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DBAdapter } from 'src/db/db.adapter';
import { DBService, TranslationSchema } from 'src/db/db.service';

type CreateParams = {
  groupId: UUID;
  key: string;
  values: {
    localeId: UUID;
    value: string;
  }[];
};

type UpdateParams = {
  id: UUID;
  newGroupId?: UUID;
  newKey?: string;
  newValues?: {
    localeId: UUID;
    value: string;
  }[];
};

@Injectable()
export class TranslationRepository extends DBAdapter {
  constructor(protected readonly dbService: DBService) {
    super(dbService);
  }

  async findById({ id }: { id: UUID }) {
    return this.db.get('translations').find({ id }).value();
  }

  async findManyByGroupId({ groupId }: { groupId: UUID }) {
    return this.db.get('translations').filter({ groupId }).value();
  }

  async create(params: CreateParams) {
    return this.db
      .get('translations')
      .push({ id: generateUUID(), ...params })
      .write();
  }

  async update({ id, newGroupId, newKey, newValues }: UpdateParams) {
    const updateData: Partial<TranslationSchema> = {};

    if (!!newGroupId) updateData.groupId = newGroupId;
    if (!!newKey) updateData.key = newKey;
    if (!!newValues) updateData.values = newValues;

    return this.db.get('translations').find({ id }).assign(updateData).write();
  }

  async deleteMany({ ids }: { ids: UUID[] }) {
    this.db
      .get('translations')
      .remove((translation) => ids.includes(translation.id))
      .write();
  }
}
