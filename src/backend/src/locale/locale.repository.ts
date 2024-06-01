import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DBAdapter } from 'src/db/db.adapter';
import { DBService } from 'src/db/db.service';

type FindMayParams = {
  sortBy?: string;
};

type CreateParams = {
  label: string;
  position: number;
};

type UpdateLabelParams = {
  id: UUID;
  newLabel: string;
};

type UpdatePositionParams = {
  id: UUID;
  position: number;
};

@Injectable()
export class LocaleRepository extends DBAdapter {
  constructor(protected readonly dbService: DBService) {
    super(dbService);
  }

  async findMany({ sortBy }: FindMayParams = {}) {
    return this.db.get('locales').sortBy(sortBy).value();
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
    this.db.get('locales').find({ id }).assign({ label: newLabel }).write();
  }

  async updatePosition({ id, position }: UpdatePositionParams) {
    this.db.get('locales').find({ id }).assign({ position }).write();
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
