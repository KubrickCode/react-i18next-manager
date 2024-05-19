import { Injectable } from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DBService, DB, DBSchema, GroupSchema } from 'src/db/db.service';

type AddGroupParams = {
  label: string;
  parentId: UUID | null;
};

type EditGroupLabelParams = {
  id: UUID;
  newLabel: string;
};

type EditGroupPositionParams = {
  id: UUID;
  position: number;
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
      id: generateUUID(),
      label,
      position: 0,
      children: [],
    };

    if (parentId) {
      const parentGroup = this.findGroupById(groups, parentId);
      if (parentGroup) {
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

  async editGroupLabel({ id, newLabel }: EditGroupLabelParams) {
    const groups = this.db.get('groups').value();
    const group = this.findGroupById(groups, id);

    group.label = newLabel;
    this.db.write();
  }

  async editGroupPosition({ id, position }: EditGroupPositionParams) {
    const groups = this.db.get('groups').value();
    const group = this.findGroupById(groups, id);

    if (!group) {
      throw new Error(`Group with id ${id} not found`);
    }

    const parentGroup = this.findParentGroup(groups, id);

    if (parentGroup) {
      this.reorderGroups(parentGroup.children, id, position);
    } else {
      this.reorderGroups(groups, id, position);
    }

    this.db.write();
  }

  async deleteGroup({ id }: { id: UUID }) {
    const groups = this.db.get('groups').value();
    const allGroupIds = this.collectGroupAndChildIds(groups, id);
    this.findGroupAndDelete({ id, groups });

    const translations = this.db.get('translations').value();
    const updatedTranslations = translations.filter(
      (translation) => !allGroupIds.includes(translation.groupId),
    );
    this.db.set('translations', updatedTranslations).write();
  }

  private collectGroupAndChildIds(groups: GroupSchema[], id: UUID): UUID[] {
    const groupIds: UUID[] = [];
    const collect = (group: GroupSchema) => {
      groupIds.push(group.id);
      if (group.children) {
        group.children.forEach(collect);
      }
    };

    const targetGroup = this.findGroupById(groups, id);
    if (targetGroup) {
      collect(targetGroup);
    }

    return groupIds;
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
      return;
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

  private findParentGroup(groups: GroupSchema[], id: UUID): GroupSchema | null {
    for (const group of groups) {
      if (group.children.some((child) => child.id === id)) {
        return group;
      }
      const found = this.findParentGroup(group.children, id);
      if (found) return found;
    }
    return null;
  }

  private reorderGroups(groups: GroupSchema[], id: UUID, newPosition: number) {
    const groupIndex = groups.findIndex((group) => group.id === id);

    if (groupIndex === -1) {
      throw new Error(`Group with id ${id} not found in the given group list`);
    }

    const [movedGroup] = groups.splice(groupIndex, 1);
    groups.splice(newPosition, 0, movedGroup);

    groups.forEach((group, index) => {
      group.position = index;
    });
  }
}
