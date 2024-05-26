import { ConflictException, Injectable } from '@nestjs/common';
import { LocaleRepository } from './locale.repository';
import { UUID } from 'src/common/types';

type AddParams = {
  label: string;
  position: number;
};

type EditLabelParams = {
  id: UUID;
  newLabel: string;
};

type EditPositionParams = {
  locales: {
    id: UUID;
    position: number;
  }[];
};

@Injectable()
export class LocaleService {
  constructor(private readonly localeRepository: LocaleRepository) {}

  async getAll() {
    return { locales: await this.localeRepository.findMany() };
  }

  async add({ label, position }: AddParams) {
    const exists = await this.localeRepository.findByLabel({
      label,
    });
    if (exists) {
      throw new ConflictException(
        `Locale with label "${label}" already exists.`,
      );
    }

    return await this.localeRepository.create({ label, position });
  }

  async editPosition(params: EditPositionParams) {
    return await this.localeRepository.updatePosition(params);
  }

  async editLabel({ id, newLabel }: EditLabelParams) {
    const label = await this.localeRepository.findByLabel({
      label: newLabel,
    });
    if (label && label.id !== id) {
      throw new ConflictException(
        `Locale with label "${newLabel}" already exists.`,
      );
    }

    return await this.localeRepository.updateLabel({ id, newLabel });
  }

  async delete({ id }: { id: UUID }) {
    return await this.localeRepository.delete({ id });
  }
}
