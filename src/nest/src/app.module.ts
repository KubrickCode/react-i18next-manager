import { Module } from '@nestjs/common';
import { LocaleModule } from './locale/locale.module';

@Module({
  imports: [LocaleModule],
})
export class AppModule {}
