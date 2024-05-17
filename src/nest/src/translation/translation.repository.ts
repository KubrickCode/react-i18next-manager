import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DB, DBService } from 'src/db/db.service';

type AddTranslationParams = {
  groupId: UUID;
  localeId: UUID;
  key: string;
  value: string;
};

type EditTranslationParams = {
  id: UUID;
  value: string;
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

  async editTranslation({ id, value }: EditTranslationParams) {
    const translations = this.db.get('translations').value();
    const index = translations.findIndex((t) => t.id === id);
    if (index !== -1) {
      translations[index] = {
        ...translations[index],
        value,
      };
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
