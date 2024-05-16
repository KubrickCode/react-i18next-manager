import { Injectable } from '@nestjs/common';
import { LocaleRepository } from './locale.repository';
import { UUID } from 'src/common/types';

type AddLocaleParams = {
  label: string;
  position: number;
};

type EditLocaleParams = {
  id: UUID;
  newLabel?: string;
  newPosition?: number;
};

@Injectable()
export class LocaleService {
  constructor(private readonly localeRepository: LocaleRepository) {}

  async getLocales() {
    return await this.localeRepository.getLocales();
  }

  async addLocale(params: AddLocaleParams) {
    return await this.localeRepository.addLocale(params);
  }

  async editLocale(params: EditLocaleParams) {
    return await this.localeRepository.editLocale(params);
  }

  async deleteLocale({ id }: { id: UUID }) {
    return await this.localeRepository.deleteLocale({ id });
  }
}
