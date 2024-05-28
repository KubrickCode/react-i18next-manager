import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationRepository } from './translation.repository';
import { TranslationController } from './translation.controller';
import { DBModule } from 'src/db/db.module';
import { GroupRepository } from 'src/group/group.repository';

@Module({
  imports: [DBModule],
  controllers: [TranslationController],
  providers: [TranslationService, TranslationRepository, GroupRepository],
})
export class TranslationModule {}
