import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DBAdapter } from 'src/db/db.adapter';
import { DBService } from 'src/db/db.service';

type CreateParams = {
  label: string;
  position: number;
};

type UpdateLabelParams = {
  id: UUID;
  newLabel: string;
};

type UpdatePositionParams = {
  locales: {
    id: UUID;
    position: number;
  }[];
};

@Injectable()
export class LocaleRepository extends DBAdapter {
  constructor(protected readonly dbService: DBService) {
    super(dbService);
  }

  async findMany() {
    return this.db.get('locales').sortBy('position').value();
  }

  async findByLabel({ label }: { label: string }) {
    return this.db.get('locales').find({ label }).value();
  }

  async create({ label, position }: CreateParams) {
    const locales = this.db.get('locales').value();
    const id = generateUUID();
    locales.push({ id, label, position });

    const translations = this.db.get('translations').value();
    translations.forEach((translation) => {
      translation.values.push({ localeId: id, value: '' });
    });

    this.db.write();
  }

  async updateLabel({ id, newLabel }: UpdateLabelParams) {
    const locales = this.db.get('locales').value();
    const locale = locales.find((locale) => locale.id === id);

    locale.label = newLabel;

    this.db.write();
  }

  async updatePosition({ locales }: UpdatePositionParams) {
    const localesData = this.db.get('locales').value();
    locales.forEach((locale) => {
      const localeData = localesData.find((data) => data.id === locale.id);
      if (localeData) {
        localeData.position = locale.position;
      }
    });
    this.db.write();
  }

  async delete({ id }: { id: UUID }) {
    const locales = this.db.get('locales').value();
    const localeIndex = locales.findIndex((locale) => locale.id === id);

    if (localeIndex === -1) return;

    locales.splice(localeIndex, 1);

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
