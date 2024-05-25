import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller()
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('generate-i18n')
  @HttpCode(HttpStatus.CREATED)
  async generateI18nJson() {
    await this.commonService.generateI18nJson();
    return { message: 'i18n.json generated successfully' };
  }
}
