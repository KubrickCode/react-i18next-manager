import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { DB, DBService } from 'src/db/db.service';

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
}
