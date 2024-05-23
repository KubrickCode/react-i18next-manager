import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ResponseDtoInterceptor } from 'src/common/decorator/response-dto.decorator';
import { TranslationService } from './translation.service';
import {
  GetTranslationsReqParamDto,
  GetTranslationsResDto,
} from './dto/get-translations.dto';
import {
  AddTranslationReqBodyDto,
  AddTranslationReqParamDto,
} from './dto/add-translation.dto';
import {
  EditTranslationReqBodyDto,
  EditTranslationReqParamDto,
} from './dto/edit-translation.dto';
import { DeleteTranslationsReqBodyDto } from './dto/delete-translations.dto';

@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get(':groupId')
  @HttpCode(HttpStatus.OK)
  @ResponseDtoInterceptor(GetTranslationsResDto)
  async getTranslations(@Param() param: GetTranslationsReqParamDto) {
    return await this.translationService.getTranslations(param);
  }

  @Post('/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTranslation(@Body() body: DeleteTranslationsReqBodyDto) {
    return await this.translationService.deleteTranslations(body);
  }

  @Post(':groupId')
  @HttpCode(HttpStatus.CREATED)
  async addTranslation(
    @Param() param: AddTranslationReqParamDto,
    @Body() body: AddTranslationReqBodyDto,
  ) {
    return await this.translationService.addTranslation({
      ...param,
      ...body,
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editTranslation(
    @Param() param: EditTranslationReqParamDto,
    @Body() body: EditTranslationReqBodyDto,
  ) {
    return await this.translationService.editTranslation({
      ...param,
      ...body,
    });
  }
}
