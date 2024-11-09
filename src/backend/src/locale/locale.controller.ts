import {
  Body,
  Controller,
  Delete,
  Get,
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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('locales')
export class LocaleController {
  constructor(private readonly localeService: LocaleService) {}

  @Get()
  @ApiOkResponse({ type: GetLocalesResDto })
  @ResponseDtoInterceptor(GetLocalesResDto)
  async getAll() {
    return await this.localeService.getAll();
  }

  @Post()
  @ApiCreatedResponse({ type: GetLocalesResDto })
  async add(@Body() body: AddLocaleReqBodyDto) {
    return await this.localeService.add(body);
  }

  @Patch('label/:id')
  @ApiNoContentResponse()
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
  @ApiNoContentResponse()
  async editPosition(@Body() body: EditLocalesPositionReqBodyDto) {
    return await this.localeService.editPosition(body);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  async delete(@Param() { id }: DeleteLocaleReqParamDto) {
    return await this.localeService.delete({ id });
  }
}
