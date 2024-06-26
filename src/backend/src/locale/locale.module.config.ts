import { DBModule } from 'src/db/db.module';
import { LocaleController } from './locale.controller';
import { LocaleService } from './locale.service';
import { LocaleRepository } from './locale.repository';

export const localeModuleConfig = {
  imports: [DBModule],
  controllers: [LocaleController],
  providers: [LocaleService, LocaleRepository],
};
