import { DBModule } from 'src/db/db.module';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { TranslationRepository } from './translation.repository';
import { GroupRepository } from 'src/group/group.repository';

export const translationModuleConfig = {
  imports: [DBModule],
  controllers: [TranslationController],
  providers: [TranslationService, TranslationRepository, GroupRepository],
};
