import { Module } from '@nestjs/common';
import { DBModule } from 'src/db';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { TranslationRepository } from 'src/translation';

@Module({
  imports: [DBModule],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, TranslationRepository],
})
export class GroupModule {}
