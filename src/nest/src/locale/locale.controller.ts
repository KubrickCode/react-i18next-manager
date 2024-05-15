import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LocaleService } from './locale.service';
import { ResponseDtoInterceptor } from 'src/common/decorator/response-dto.decorator';
import { GetLocalesResDto } from './dto/get-locales.dto';
import { AddLocaleReqBodyDto } from './dto/add-locale.dto';
import {
  EditLocaleReqBodyDto,
  EditLocaleReqParamDto,
} from './dto/edit-locale.dto';

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

  @Patch(':id')
  async editLocale(
    @Param() param: EditLocaleReqParamDto,
    @Body() body: EditLocaleReqBodyDto,
  ) {
    return await this.localeService.editLocale({
      ...param,
      ...body,
    });
  }
}
