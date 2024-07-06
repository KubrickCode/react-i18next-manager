import { ConflictException, Injectable } from '@nestjs/common';
import { LocaleRepository } from './locale.repository';
import { UUID } from 'src/common/types';

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
    const locales = await this.localeRepository.findMany({
      sortBy: 'position',
    });
    return {
      locales,
    };
  }

  async add({ label }: { label: string }) {
    const exists = await this.localeRepository.findByLabel({
      label,
    });
    if (exists) {
      throw new ConflictException(
        `Locale with label "${label}" already exists.`,
      );
    }

    const position = await this.localeRepository.count();

    return await this.localeRepository.create({ label, position });
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

  async editPosition({ locales }: EditPositionParams) {
    const promises = locales.map((locale) =>
      this.localeRepository.updatePosition(locale),
    );
    await Promise.all(promises);
  }

  async delete({ id }: { id: UUID }) {
    return await this.localeRepository.delete({ id });
  }
}
