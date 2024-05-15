import { Injectable } from '@nestjs/common';
import { DBService, DBSchema, DB } from 'src/db/db.service';

type AddLocaleParams = {
  locales: DBSchema['locales'];
  newLocale: { id: string; label: string; position: number };
};

type EditLocaleParams = {
  locale: DBSchema['locales'][number];
  newLocale: {
    newLabel?: string;
    newPosition?: number;
  };
};

type DeleteLocaleParams = {
  localeIndex: number;
  locales: DBSchema['locales'];
};

@Injectable()
export class LocaleRepository {
  private db: DB;

  constructor(private readonly dbService: DBService) {
    this.initializeDb();
  }

  private async initializeDb() {
    this.db = await this.dbService.getDb();
  }

  async getLocales() {
    return this.db.get('locales').value();
  }

  async addLocale({ locales, newLocale }: AddLocaleParams) {
    locales.push(newLocale);
    this.db.write();
  }

  async editLocale({
    locale,
    newLocale: { newLabel, newPosition },
  }: EditLocaleParams) {
    typeof newLabel === 'string' && (locale.label = newLabel);
    typeof newPosition === 'number' && (locale.position = newPosition);

    this.db.write();
  }

  async deleteLocale({ localeIndex, locales }: DeleteLocaleParams) {
    if (localeIndex === -1) return;

    locales.splice(localeIndex, 1);
    this.db.write();
  }
}
