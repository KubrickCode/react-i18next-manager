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

@Controller('locales')
export class LocaleController {
  constructor(private readonly localeService: LocaleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseDtoInterceptor(GetLocalesResDto)
  async getAll() {
    return await this.localeService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() body: AddLocaleReqBodyDto) {
    return await this.localeService.add(body);
  }

  @Patch('label/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editLabel(
    @Param() param: EditLocaleLabelReqParamDto,
    @Body() body: EditLocaleLabelReqBodyDto,
  ) {
    return await this.localeService.editLabel({
      ...param,
      ...body,
    });
  }

  @Patch('position')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editPosition(@Body() body: EditLocalesPositionReqBodyDto) {
    return await this.localeService.editPosition(body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() { id }: DeleteLocaleReqParamDto) {
    return await this.localeService.delete({ id });
  }
}
