import { Body, Controller, Get, Post } from '@nestjs/common';
import { LocaleService } from './locale.service';
import { ResponseDtoInterceptor } from 'src/common/decorator/response-dto.decorator';
import { GetLocalesResDto } from './dto/get-locales.dto';
import { AddLocaleReqBodyDto } from './dto/add-locale.dto';

@Controller('locales')
export class LocaleController {
  constructor(private readonly localeService: LocaleService) {}

  @Get()
  @ResponseDtoInterceptor(GetLocalesResDto)
  async getLocales() {
    return await this.localeService.getLocales();
  }

  @Post()
  async addLocale(@Body() body: AddLocaleReqBodyDto) {
    return await this.localeService.addLocale(body);
  }
}
