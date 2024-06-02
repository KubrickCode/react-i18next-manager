import { generateUUID } from 'src/common/utils';
import { DB } from 'src/db/db.service';

export class LocaleFactory {
  constructor(private readonly db: DB) {}

  create({ label, position }: { label: string; position: number }) {
    const locale = {
      id: generateUUID(),
      label,
      position,
    };
    this.db.get('locales').push(locale).write();
    return locale;
  }
}
