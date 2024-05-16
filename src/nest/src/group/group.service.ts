import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { UUID } from 'src/common/types';

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
  newPosition: number;
};

type EditGroupsPositionParams = {
  groups: EditGroupPositionParams[];
};

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getGroups() {
    return await this.groupRepository.getGroups();
  }

  async addGroup(params: AddGroupParams) {
    return await this.groupRepository.addGroup(params);
  }

  async editGroupLabel(params: EditGroupLabelParams) {
    return await this.groupRepository.editGroupLabel(params);
  }

  async editGroupsPosition(params: EditGroupsPositionParams) {
    return await this.groupRepository.editGroupsPosition(params);
  }

  async deleteGroup({ id }: { id: UUID }) {
    return await this.groupRepository.deleteGroup({ id });
  }
}
