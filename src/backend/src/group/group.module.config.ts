import { DBModule } from 'src/db/db.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { TranslationRepository } from 'src/translation/translation.repository';

export const groupModuleConfig = {
  imports: [DBModule],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, TranslationRepository],
};
