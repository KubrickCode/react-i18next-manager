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
    const id = generateUUID();

    this.db.get('locales').push({ id, label, position }).write();
    this.db
      .get('translations')
      .each((translation) => {
        translation.values.push({ localeId: id, value: '' });
      })
      .write();
  }

  async updateLabel({ id, newLabel }: UpdateLabelParams) {
    this.db.get('locales').find({ id }).assign({ label: newLabel }).write();
  }

  async updatePosition({ id, position }: UpdatePositionParams) {
    this.db.get('locales').find({ id }).assign({ position }).write();
  }

  async delete({ id }: { id: UUID }) {
    this.db.get('locales').remove({ id }).write();
    this.db
      .get('translations')
      .each((translation) => {
        const valueIndex = translation.values.findIndex(
          (value) => value.localeId === id,
        );
        if (valueIndex !== -1) {
          translation.values.splice(valueIndex, 1);
        }
      })
      .write();
  }
}
