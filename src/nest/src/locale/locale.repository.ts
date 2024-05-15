import { Injectable } from '@nestjs/common';
import { DBService, Locales, LocaleDB } from 'src/db/db.service';

type AddLocaleParams = {
  locales: Locales['locales'];
  newLocale: { id: string; label: string; position: number };
};

type EditLocaleParams = {
  id: string;
  newLabel?: string;
  newPosition?: number;
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

  async addLocale({ locales, newLocale }: AddLocaleParams) {
    locales.push(newLocale);
    this.db.write();
  }

  async editLocale({ id, newLabel, newPosition }: EditLocaleParams) {
    const { locales } = this.db.getState();
    const locale = locales.find((locale) => locale.id === id);

    typeof newLabel === 'string' && (locale.label = newLabel);
    typeof newPosition === 'number' && (locale.position = newPosition);

    this.db.write();
  }

  async deleteLocale({ id }: { id: string }) {
    const { locales } = this.db.getState();
    const localeIndex = locales.findIndex((locale) => locale.id === id);

    if (localeIndex === -1) return;

    locales.splice(localeIndex, 1);
    this.db.write();
  }
}
