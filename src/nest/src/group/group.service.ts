import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getGroups() {
    return await this.groupRepository.getGroups();
  }

  async deleteGroup({ id }: { id: string }) {
    const groups = await this.groupRepository.getGroups();

    return await this.groupRepository.deleteGroup({ groupId: id, groups });
  }
}
