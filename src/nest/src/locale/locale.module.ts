import { Module } from '@nestjs/common';
import { LocaleService } from './locale.service';
import { LocaleRepository } from './locale.repository';
import { LocaleController } from './locale.controller';

@Module({
  imports: [],
  controllers: [LocaleController],
  providers: [LocaleService, LocaleRepository],
})
export class LocaleModule {}
