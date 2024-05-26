import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { UUID } from 'src/common/types';

type AddParams = {
  label: string;
  parentId: UUID | null;
};

type EditLabelParams = {
  id: UUID;
  newLabel: string;
};

type EditPositionParams = {
  id: UUID;
  position: number;
};

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getAll() {
    return { groups: await this.groupRepository.findMany() };
  }

  async add(params: AddParams) {
    return await this.groupRepository.create(params);
  }

  async editPosition(params: EditPositionParams) {
    return await this.groupRepository.updatePosition(params);
  }

  async editLabel(params: EditLabelParams) {
    return await this.groupRepository.updateLabel(params);
  }

  async delete({ id }: { id: UUID }) {
    return await this.groupRepository.delete({ id });
  }
}
