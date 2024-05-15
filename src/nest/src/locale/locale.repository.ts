import { Injectable } from '@nestjs/common';
import { DBService, LocaleDB } from 'src/db/db.service';

type AddLocaleParams = {
  id: string;
  label: string;
  position: number;
};

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

  async addLocale(newLocale: AddLocaleParams) {
    const locales = this.db.getState().locales;
    locales.push(newLocale);
    this.db.write();
  }
}
