import { Controller, Get } from '@nestjs/common';
import { LocaleService } from './locale.service';

@Controller('locales')
export class LocaleController {
  constructor(private readonly localeService: LocaleService) {}

  @Get()
  async getLocales() {
    return await this.localeService.getLocales();
  }
}
