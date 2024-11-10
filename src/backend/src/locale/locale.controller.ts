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
import { ResponseDtoInterceptor } from 'src/common/decorator';
import {
  GetLocalesResDto,
  AddLocaleReqBodyDto,
  EditLocaleLabelReqBodyDto,
  EditLocaleLabelReqParamDto,
  DeleteLocaleReqParamDto,
  EditLocalesPositionReqBodyDto,
} from './dto';
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
