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
import {
  EditTranslationParentGroupReqBodyDto,
  EditTranslationParentGroupReqParamDto,
} from './dto/edit-translation-parent-group.dto';

@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get(':groupId')
  @HttpCode(HttpStatus.OK)
  @ResponseDtoInterceptor(GetTranslationsResDto)
  async getAll(@Param() param: GetTranslationsReqParamDto) {
    return await this.translationService.getAll(param);
  }

  @Post('/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMany(@Body() body: DeleteTranslationsReqBodyDto) {
    return await this.translationService.deleteMany(body);
  }

  @Post(':groupId')
  @HttpCode(HttpStatus.CREATED)
  async add(
    @Param() param: AddTranslationReqParamDto,
    @Body() body: AddTranslationReqBodyDto,
  ) {
    return await this.translationService.add({
      ...param,
      ...body,
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async edit(
    @Param() param: EditTranslationReqParamDto,
    @Body() body: EditTranslationReqBodyDto,
  ) {
    return await this.translationService.edit({
      ...param,
      ...body,
    });
  }

  @Patch(':id/group')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editParentGroup(
    @Param() param: EditTranslationParentGroupReqParamDto,
    @Body() body: EditTranslationParentGroupReqBodyDto,
  ) {
    return await this.translationService.editParentGroup({
      ...param,
      ...body,
    });
  }
}
