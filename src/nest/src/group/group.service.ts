import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { UUID } from 'src/common/types';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getGroups() {
    return await this.groupRepository.getGroups();
  }

  async deleteGroup({ id }: { id: UUID }) {
    return await this.groupRepository.deleteGroup({ id });
  }
}
