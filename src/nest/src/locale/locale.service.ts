import { Injectable } from '@nestjs/common';
import { LocaleRepository } from './locale.repository';

@Injectable()
export class LocaleService {
  constructor(private readonly localeRepository: LocaleRepository) {}

  async getLocales() {
    return await this.localeRepository.getLocales();
  }
}
