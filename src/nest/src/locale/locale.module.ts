import { Module } from '@nestjs/common';
import { LocaleService } from './locale.service';
import { LocaleRepository } from './locale.repository';
import { LocaleController } from './locale.controller';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [LocaleController],
  providers: [LocaleService, LocaleRepository],
})
export class LocaleModule {}
