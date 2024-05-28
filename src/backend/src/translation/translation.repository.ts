import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DB, DBService } from 'src/db/db.service';

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
  newKey: string;
  newValues: {
    localeId: UUID;
    value: string;
  }[];
};

@Injectable()
export class TranslationRepository {
  private db: DB;

  constructor(private readonly dbService: DBService) {
    this.initializeDb();
  }

  private async initializeDb() {
    this.db = await this.dbService.get();
  }

  async findById({ id }: { id: UUID }) {
    const translations = this.db.get('translations').value();
    return translations.find((t) => t.id === id);
  }

  async findManyByGroupId({ groupId }: { groupId: UUID }) {
    return this.db.get('translations').filter({ groupId }).value();
  }

  async create(params: CreateParams) {
    const translations = this.db.get('translations').value();
    translations.push({ id: generateUUID(), ...params });
    this.db.write();
  }

  async update({ id, newKey, newValues }: UpdateParams) {
    const translation = await this.findById({ id });

    translation.key = newKey;
    translation.values = newValues;
    this.db.write();
  }

  async deleteMany({ ids }: { ids: UUID[] }) {
    const translations = this.db.get('translations').value();
    const remainingTranslations = translations.filter(
      (translation) => !ids.includes(translation.id),
    );
    this.db.set('translations', remainingTranslations).write();
  }

  async deleteByGroupIds({ groupIds }: { groupIds: UUID[] }) {
    const translations = this.db.get('translations').value();
    const updatedTranslations = translations.filter(
      (translation) => !groupIds.includes(translation.groupId),
    );
    this.db.set('translations', updatedTranslations).write();
  }
}
