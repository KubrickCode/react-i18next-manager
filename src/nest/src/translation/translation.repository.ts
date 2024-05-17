import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DB, DBService } from 'src/db/db.service';

type AddTranslationsParams = {
  groupId: UUID;
  newTranslations: {
    localeId: UUID;
    key: string;
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

  async addTranslations({ groupId, newTranslations }: AddTranslationsParams) {
    const translations = this.db.get('translations').value();
    for (const newTranslation of newTranslations) {
      translations.push({ id: generateUUID(), groupId, ...newTranslation });
    }
    this.db.write();
  }
}
