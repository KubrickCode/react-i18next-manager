import { Module } from '@nestjs/common';
import { DBModule } from 'src/db';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { TranslationRepository } from './translation.repository';
import { GroupRepository } from 'src/group';

@Module({
  imports: [DBModule],
  controllers: [TranslationController],
  providers: [TranslationService, TranslationRepository, GroupRepository],
})
export class TranslationModule {}
