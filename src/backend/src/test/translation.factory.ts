import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DB } from 'src/db/db.service';

export class TranslationFactory {
  constructor(private readonly db: DB) {}

  create({
    key,
    values,
  }: {
    key: string;
    values: { localeId: UUID; value: string }[];
  }) {
    const translation = {
      id: generateUUID(),
      groupId: generateUUID(),
      key,
      values,
    };
    this.db.get('translations').push(translation).write();
    return translation;
  }
}
