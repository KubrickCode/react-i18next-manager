import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { DBService, DB, DBSchema, GroupSchema } from 'src/db/db.service';
import { v4 as uuidv4 } from 'uuid';

type AddGroupParams = {
  label: string;
  parentId: UUID | null;
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

  async addGroup({ label, parentId }: AddGroupParams) {
    const groups = this.db.get('groups').value();
    const newGroup: GroupSchema = {
      id: uuidv4(),
      label,
      position: 0,
    };

    if (parentId) {
      const parentGroup = this.findGroupById(groups, parentId);
      if (parentGroup) {
        if (!parentGroup.children) {
          parentGroup.children = [];
        }
        newGroup.position = parentGroup.children.length;
        parentGroup.children.push(newGroup);
      } else {
        throw new Error(`Parent group with id ${parentId} not found`);
      }
    } else {
      newGroup.position = groups.length;
      groups.push(newGroup);
    }

    this.db.write();
    return newGroup;
  }

  async deleteGroup({ id }: { id: UUID }) {
    const groups = this.db.get('groups').value();
    this.findGroupAndDelete({ id, groups });
    this.db.write();
  }

  private findGroupById(groups: GroupSchema[], id: UUID): GroupSchema | null {
    for (const group of groups) {
      if (group.id === id) return group;
      const found = this.findGroupById(group.children, id);
      if (found) return found;
    }
    return null;
  }

  private findGroupAndDelete({
    id,
    groups,
  }: {
    id: UUID;
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
