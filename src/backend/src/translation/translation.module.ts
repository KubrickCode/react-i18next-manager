import { Module } from '@nestjs/common';
import { translationModuleConfig } from './translation.module.config';

@Module(translationModuleConfig)
export class TranslationModule {}
