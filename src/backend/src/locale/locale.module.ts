import { Module } from '@nestjs/common';
import { localeModuleConfig } from './locale.module.config';

@Module(localeModuleConfig)
export class LocaleModule {}
