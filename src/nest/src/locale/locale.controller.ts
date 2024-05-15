import { Controller, Get } from '@nestjs/common';
import { LocaleService } from './locale.service';
import { ResponseDtoInterceptor } from 'src/common/decorator/response-dto.decorator';
import { GetLocalesResDto } from './dto/get-locales.dto';

@Controller('locales')
export class LocaleController {
  constructor(private readonly localeService: LocaleService) {}

  @Get()
  @ResponseDtoInterceptor(GetLocalesResDto)
  async getLocales() {
    return await this.localeService.getLocales();
  }
}
