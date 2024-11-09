import { Controller, Post } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller()
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('generate-i18n')
  @ApiCreatedResponse()
  async generateI18nResources() {
    await this.commonService.generateI18nResources();
    return { message: 'I18n resources generated successfully' };
  }
}
