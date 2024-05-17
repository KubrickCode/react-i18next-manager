import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DBService, DB } from 'src/db/db.service';

type AddLocaleParams = {
  label: string;
  position: number;
};

type EditLocaleParams = {
  id: UUID;
  newLabel?: string;
  newPosition?: number;
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

  async addLocale({ label, position }: AddLocaleParams) {
    const locales = this.db.get('locales').value();
    locales.push({ id: generateUUID(), label, position });
    this.db.write();
  }

  async editLocale({ id, newLabel, newPosition }: EditLocaleParams) {
    const locales = this.db.get('locales').value();
    const locale = locales.find((locale) => locale.id === id);

    typeof newLabel === 'string' && (locale.label = newLabel);
    typeof newPosition === 'number' && (locale.position = newPosition);

    this.db.write();
  }

  async deleteLocale({ id }: { id: UUID }) {
    const locales = this.db.get('locales').value();
    const localeIndex = locales.findIndex((locale) => locale.id === id);

    if (localeIndex === -1) return;

    locales.splice(localeIndex, 1);
    this.db.write();
  }
}
