import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'src/common/types';
import { generateUUID } from 'src/common/utils';
import { DB, DBService, GroupSchema } from 'src/db/db.service';

type CreateParams = {
  groupId: UUID;
  key: string;
  values: {
    localeId: UUID;
    value: string;
  }[];
};

type UpdateParams = {
  id: UUID;
  newKey: string;
  newValues: {
    localeId: UUID;
    value: string;
  }[];
};

@Injectable()
export class TranslationRepository {
  private db: DB;

  constructor(private readonly dbService: DBService) {
    this.initializeDb();
  }

  private async initializeDb() {
    this.db = await this.dbService.get();
  }

  async findManyByGroupId({ groupId }: { groupId: UUID }) {
    return this.db.get('translations').filter({ groupId }).value();
  }

  async create(params: CreateParams) {
    const { groupId, key } = params;
    this.checkDuplicateKeyInGroup(groupId, key);
    this.checkDuplicateKeyWithGroupLabels(groupId, key);

    const translations = this.db.get('translations').value();
    translations.push({ id: generateUUID(), ...params });
    this.db.write();
  }

  async update({ id, newKey, newValues }: UpdateParams) {
    const translations = this.db.get('translations').value();
    const translation = translations.find((t) => t.id === id);

    if (!translation) {
      throw new NotFoundException(`Translation with id "${id}" not found`);
    }

    this.checkDuplicateKeyInGroup(translation.groupId, newKey, id);
    this.checkDuplicateKeyWithGroupLabels(translation.groupId, newKey);

    translation.key = newKey;
    translation.values = newValues;
    this.db.write();
  }

  async delete({ id }: { id: UUID }) {
    const translations = this.db.get('translations').value();
    const index = translations.findIndex((t) => t.id === id);
    if (index !== -1) {
      translations.splice(index, 1);
    }
    this.db.write();
  }

  private checkDuplicateKeyInGroup(
    groupId: UUID,
    key: string,
    excludeId?: UUID,
  ) {
    const translations = this.db
      .get('translations')
      .filter({ groupId })
      .value();
    if (translations.some((t) => t.key === key && t.id !== excludeId)) {
      throw new ConflictException(
        `Translation key "${key}" already exists in the group "${groupId}".`,
      );
    }
  }

  private checkDuplicateKeyWithGroupLabels(groupId: UUID, key: string) {
    const groups = this.db.get('groups').value();
    const group = this.findGroupById(groups, groupId);

    if (!group) {
      throw new NotFoundException(`Group with id "${groupId}" not found.`);
    }

    const checkLabel = (group: GroupSchema) => {
      if (group.label === key) {
        throw new ConflictException(
          `Translation key "${key}" conflicts with a group label in the hierarchy.`,
        );
      }
      group.children.forEach(checkLabel);
    };

    checkLabel(group);
  }

  private findGroupById(groups: GroupSchema[], id: UUID): GroupSchema | null {
    for (const group of groups) {
      if (group.id === id) return group;
      const found = this.findGroupById(group.children, id);
      if (found) return found;
    }
    return null;
  }

  async deleteByGroupIds({ groupIds }: { groupIds: UUID[] }) {
    const translations = this.db.get('translations').value();
    const updatedTranslations = translations.filter(
      (translation) => !groupIds.includes(translation.groupId),
    );
    this.db.set('translations', updatedTranslations).write();
  }
}
