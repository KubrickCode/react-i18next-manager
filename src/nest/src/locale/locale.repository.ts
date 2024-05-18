import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DBService, DB } from 'src/db/db.service';

type AddLocaleParams = {
  label: string;
  position: number;
};

type EditLocaleLabelParams = {
  id: UUID;
  newLabel?: string;
};

type EditLocalesPositionParams = {
  locales: {
    id: UUID;
    position: number;
  }[];
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
    return this.db.get('locales').sortBy('position').value();
  }

  async addLocale({ label, position }: AddLocaleParams) {
    const id = generateUUID();

    const locales = this.db.get('locales').value();
    locales.push({ id, label, position });
    this.db.write();

    const translations = this.db.get('translations').value();
    translations.forEach((translation) => {
      translation.values.push({ localeId: id, value: '' });
    });
    this.db.write();
  }

  async editLocaleLabel({ id, newLabel }: EditLocaleLabelParams) {
    const locales = this.db.get('locales').value();
    const locale = locales.find((locale) => locale.id === id);

    typeof newLabel === 'string' && (locale.label = newLabel);

    this.db.write();
  }

  async editLocalesPosition({ locales }: EditLocalesPositionParams) {
    const localesData = this.db.get('locales').value();
    locales.forEach((locale) => {
      const localeData = localesData.find((data) => data.id === locale.id);
      if (localeData) {
        localeData.position = locale.position;
      }
    });
    this.db.write();
  }

  async deleteLocale({ id }: { id: UUID }) {
    const locales = this.db.get('locales').value();
    const localeIndex = locales.findIndex((locale) => locale.id === id);

    if (localeIndex === -1) return;

    locales.splice(localeIndex, 1);
    this.db.write();

    const translations = this.db.get('translations').value();
    translations.forEach((translation) => {
      const valueIndex = translation.values.findIndex(
        (value) => value.localeId === id,
      );
      if (valueIndex !== -1) {
        translation.values.splice(valueIndex, 1);
      }
    });
    this.db.write();
  }
}
