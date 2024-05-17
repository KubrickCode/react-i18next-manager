import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseDtoInterceptor } from 'src/common/decorator/response-dto.decorator';
import { TranslationService } from './translation.service';
import {
  GetTranslationsReqParamDto,
  GetTranslationsResDto,
} from './dto/get-translations.dto';
import {
  AddTranslationsReqBodyDto,
  AddTranslationsReqParamDto,
} from './dto/add-translations.dto';
import { EditTranslationsReqBodyDto } from './dto/edit-translations.dto';
import { UUID } from 'src/common/types';

@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get(':groupId')
  @HttpCode(HttpStatus.OK)
  @ResponseDtoInterceptor(GetTranslationsResDto)
  async getTranslations(@Param() param: GetTranslationsReqParamDto) {
    return await this.translationService.getTranslations(param);
  }

  @Post(':groupId')
  @HttpCode(HttpStatus.CREATED)
  async addTranslations(
    @Param() param: AddTranslationsReqParamDto,
    @Body() body: AddTranslationsReqBodyDto,
  ) {
    return await this.translationService.addTranslations({
      ...param,
      ...body,
    });
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async editTranslations(@Body() body: EditTranslationsReqBodyDto) {
    return await this.translationService.editTranslations({
      ...body,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTranslations(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: UUID[],
  ) {
    return await this.translationService.deleteTranslations({ ids });
  }
}
