import { Module } from '@nestjs/common';
import { DBModule } from 'src/db';
import { LocaleController } from './locale.controller';
import { LocaleService } from './locale.service';
import { LocaleRepository } from './locale.repository';

@Module({
  imports: [DBModule],
  controllers: [LocaleController],
  providers: [LocaleService, LocaleRepository],
})
export class LocaleModule {}
