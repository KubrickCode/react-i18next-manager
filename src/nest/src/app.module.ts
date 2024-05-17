import { Module } from '@nestjs/common';
import { LocaleModule } from './locale/locale.module';
import { GroupModule } from './group/group.module';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [LocaleModule, GroupModule, TranslationModule],
})
export class AppModule {}
