import { Injectable } from '@nestjs/common';
import { DBService, DB, DBSchema } from 'src/db/db.service';

type DeleteGroupParams = {
  id: string;
};

@Injectable()
export class GroupRepository {
  private db: DB;

  constructor(private readonly dbService: DBService) {
    this.initializeDb();
  }

  private async initializeDb() {
    this.db = await this.dbService.getDb();
  }

  async getGroups() {
    return this.db.get('groups').value();
  }

  async deleteGroup({ id }: DeleteGroupParams) {
    const groups = this.db.get('groups').value();
    this.findGroupAndDelete({ id, groups });
    this.db.write();
  }

  private findGroupAndDelete({
    id,
    groups,
  }: {
    id: string;
    groups: DBSchema['groups'];
  }) {
    const index = groups.findIndex((group) => group.id === id);

    if (index !== -1) {
      groups.splice(index, 1);
    }

    for (const group of groups) {
      if (group.children) {
        this.findGroupAndDelete({
          id,
          groups: group.children,
        });
      }
    }
  }
}
