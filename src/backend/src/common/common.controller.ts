import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller()
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('generate-i18n')
  @HttpCode(HttpStatus.CREATED)
  async generateI18nResources() {
    await this.commonService.generateI18nResources();
    return { message: 'I18n resources generated successfully' };
  }
}
