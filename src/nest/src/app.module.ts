import { Module } from '@nestjs/common';
import { LocaleModule } from './locale/locale.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [LocaleModule, GroupModule],
})
export class AppModule {}
