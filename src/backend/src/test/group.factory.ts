import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DB } from 'src/db/db.service';

export class GroupFactory {
  constructor(private readonly db: DB) {}

  create({
    label,
    parentId,
    position,
  }: {
    label: string;
    parentId: UUID | null;
    position: number;
  }) {
    const group = {
      id: generateUUID(),
      label,
      parentId,
      position,
    };
    this.db.get('groups').push(group).write();
    return group;
  }
}
