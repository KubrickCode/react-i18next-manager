import { Injectable } from '@nestjs/common';
import { LocaleRepository } from './locale.repository';
import { v4 as uuidv4 } from 'uuid';

type AddLocaleParams = {
  label: string;
  position: number;
};

@Injectable()
export class LocaleService {
  constructor(private readonly localeRepository: LocaleRepository) {}

  async getLocales() {
    return await this.localeRepository.getLocales();
  }

  async addLocale({ label, position }: AddLocaleParams) {
    return await this.localeRepository.addLocale({
      id: uuidv4(),
      label,
      position,
    });
  }
}
