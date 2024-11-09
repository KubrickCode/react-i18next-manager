import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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
import { EditTranslationsParentGroupReqBodyDto } from './dto/edit-translations-parent-group.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get(':groupId')
  @ApiOkResponse({ type: GetTranslationsResDto })
  @ResponseDtoInterceptor(GetTranslationsResDto)
  async getAll(@Param() param: GetTranslationsReqParamDto) {
    return await this.translationService.getAll(param);
  }

  @Post('/delete')
  @ApiNoContentResponse()
  async deleteMany(@Body() body: DeleteTranslationsReqBodyDto) {
    return await this.translationService.deleteMany(body);
  }

  @Post(':groupId')
  @ApiCreatedResponse()
  async add(
    @Param() param: AddTranslationReqParamDto,
    @Body() body: AddTranslationReqBodyDto,
  ) {
    return await this.translationService.add({
      ...param,
      ...body,
    });
  }

  @Patch('group')
  @ApiNoContentResponse()
  async editManyParentGroup(
    @Body() body: EditTranslationsParentGroupReqBodyDto,
  ) {
    return await this.translationService.editManyParentGroup({
      ...body,
    });
  }

  @Patch(':id')
  @ApiNoContentResponse()
  async edit(
    @Param() param: EditTranslationReqParamDto,
    @Body() body: EditTranslationReqBodyDto,
  ) {
    return await this.translationService.edit({
      ...param,
      ...body,
    });
  }
}
