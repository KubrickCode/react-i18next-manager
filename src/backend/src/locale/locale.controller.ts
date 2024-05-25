import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LocaleService } from './locale.service';
import { ResponseDtoInterceptor } from 'src/common/decorator/response-dto.decorator';
import { GetLocalesResDto } from './dto/get-locales.dto';
import { AddLocaleReqBodyDto } from './dto/add-locale.dto';
import {
  EditLocaleLabelReqBodyDto,
  EditLocaleLabelReqParamDto,
} from './dto/edit-locale-label.dto';
import { DeleteLocaleReqParamDto } from './dto/delete-locale.dto';
import { EditLocalesPositionReqBodyDto } from './dto/edit-locales-position.dto';
import i18n from 'src/db/sample/i18n-keys';

@Controller('locales')
export class LocaleController {
  constructor(private readonly localeService: LocaleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseDtoInterceptor(GetLocalesResDto)
  async getLocales() {
    console.log(i18n.keys.common.label.commonLabel);
    return await this.localeService.getLocales();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addLocale(@Body() body: AddLocaleReqBodyDto) {
    return await this.localeService.addLocale(body);
  }

  @Patch('position')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editLocalesPosition(@Body() body: EditLocalesPositionReqBodyDto) {
    return await this.localeService.editLocalesPosition(body);
  }

  @Patch('label/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editLocaleLabel(
    @Param() param: EditLocaleLabelReqParamDto,
    @Body() body: EditLocaleLabelReqBodyDto,
  ) {
    return await this.localeService.editLocaleLabel({
      ...param,
      ...body,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLocale(@Param() { id }: DeleteLocaleReqParamDto) {
    return await this.localeService.deleteLocale({ id });
  }
}
