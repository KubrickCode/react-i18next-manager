import { Module } from '@nestjs/common';
import { groupModuleConfig } from './group.module.config';

@Module(groupModuleConfig)
export class GroupModule {}
