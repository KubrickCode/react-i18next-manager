import { Injectable } from '@nestjs/common';
import { DBService, DB, DBSchema } from 'src/db/db.service';

type DeleteGroupParams = {
  groupId: string;
  groups: DBSchema['groups'];
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

  async deleteGroup(params: DeleteGroupParams) {
    this.findGroupAndDelete(params);
    this.db.write();
  }

  private findGroupAndDelete({
    groupId,
    groups,
  }: {
    groupId: string;
    groups: DBSchema['groups'];
  }) {
    const index = groups.findIndex((group) => group.id === groupId);

    if (index !== -1) {
      groups.splice(index, 1);
    }

    for (const group of groups) {
      if (group.children) {
        this.findGroupAndDelete({
          groupId,
          groups: group.children,
        });
      }
    }
  }
}
