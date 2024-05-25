import { Module } from '@nestjs/common';
import { LocaleModule } from './locale/locale.module';
import { GroupModule } from './group/group.module';
import { TranslationModule } from './translation/translation.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [LocaleModule, GroupModule, TranslationModule, CommonModule],
})
export class AppModule {}
