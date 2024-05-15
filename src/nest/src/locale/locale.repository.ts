import { Injectable } from '@nestjs/common';
import { DBService, LocaleDB } from 'src/db/db.service';

@Injectable()
export class LocaleRepository {
  private db: LocaleDB;

  constructor(private readonly dbService: DBService) {
    this.initializeDb();
  }

  private async initializeDb() {
    this.db = await this.dbService.getDb();
  }

  async getLocales() {
    return this.db.getState();
  }
}
