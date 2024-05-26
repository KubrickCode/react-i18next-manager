import { ConflictException, Injectable } from '@nestjs/common';
import { LocaleRepository } from './locale.repository';
import { UUID } from 'src/common/types';

type AddLocaleParams = {
  label: string;
  position: number;
};

type EditLocaleLabelParams = {
  id: UUID;
  newLabel: string;
};

type EditLocalesPositionParams = {
  locales: {
    id: UUID;
    position: number;
  }[];
};

@Injectable()
export class LocaleService {
  constructor(private readonly localeRepository: LocaleRepository) {}

  async getLocales() {
    return { locales: await this.localeRepository.getLocales() };
  }

  async addLocale({ label, position }: AddLocaleParams) {
    const exists = await this.localeRepository.getLocaleByLabel({
      label,
    });
    if (exists) {
      throw new ConflictException(
        `Locale with label "${label}" already exists.`,
      );
    }

    return await this.localeRepository.addLocale({ label, position });
  }

  async editLocaleLabel(params: EditLocaleLabelParams) {
    return await this.localeRepository.editLocaleLabel(params);
  }

  async editLocalesPosition(params: EditLocalesPositionParams) {
    return await this.localeRepository.editLocalesPosition(params);
  }

  async deleteLocale({ id }: { id: UUID }) {
    return await this.localeRepository.deleteLocale({ id });
  }
}
