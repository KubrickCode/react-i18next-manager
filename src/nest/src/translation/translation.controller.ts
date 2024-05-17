import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
}
