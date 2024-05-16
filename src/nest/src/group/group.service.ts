import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getGroups() {
    return await this.groupRepository.getGroups();
  }

  async deleteGroup({ id }: { id: string }) {
    return await this.groupRepository.deleteGroup({ id });
  }
}
