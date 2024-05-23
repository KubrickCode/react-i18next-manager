import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DB, DBService } from 'src/db/db.service';

type AddTranslationParams = {
  groupId: UUID;
  key: string;
  values: {
    localeId: UUID;
    value: string;
  }[];
};

type EditTranslationParams = {
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
    this.db = await this.dbService.getDb();
  }

  async getTranslations({ groupId }: { groupId: UUID }) {
    return this.db.get('translations').filter({ groupId }).value();
  }

  async addTranslation(params: AddTranslationParams) {
    const translations = this.db.get('translations').value();
    translations.push({ id: generateUUID(), ...params });
    this.db.write();
  }

  async editTranslation({ id, newKey, newValues }: EditTranslationParams) {
    const translations = this.db.get('translations').value();
    const index = translations.findIndex((t) => t.id === id);
    if (index !== -1) {
      translations[index].key = newKey;
      translations[index].values = newValues;
    }
    this.db.write();
  }

  async deleteTranslation({ id }: { id: UUID }) {
    const translations = this.db.get('translations').value();
    const index = translations.findIndex((t) => t.id === id);
    if (index !== -1) {
      translations.splice(index, 1);
    }
    this.db.write();
  }
}
