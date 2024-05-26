import { Injectable, OnModuleInit } from '@nestjs/common';
import * as lowdb from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { join } from 'path';
import {
  DBSchema,
  LocaleSchema,
  GroupSchema,
  TranslationSchema,
} from './db.schema';
import * as fs from 'fs';

export type DB = lowdb.LowdbAsync<DBSchema>;
export type { DBSchema, LocaleSchema, GroupSchema, TranslationSchema };

@Injectable()
export class DBService implements OnModuleInit {
  private db: DB;

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize() {
    const targetPath = this.getTargetPath();
    const file = join(targetPath, 'db.json');

    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    if (!fs.existsSync(file)) {
      const initialData: DBSchema = {
        locales: [],
        groups: [],
        translations: [],
      };
      fs.writeFileSync(file, JSON.stringify(initialData, null, 2));
    }

    const adapter = new FileAsync<DBSchema>(file);

    this.db = await lowdb(adapter);

    await this.db.defaults({ locales: [] }).write();
  }

  getTargetPath(): string {
    if (process.env.NODE_ENV === 'development') return 'src/db/sample';

    const configFilePath = join(process.cwd(), 'i18n-config.json');
    if (!fs.existsSync(configFilePath)) {
      throw new Error('i18n-config.json file not found in the root directory.');
    }

    const configFile = fs.readFileSync(configFilePath, 'utf8');

    const { targetPath } = JSON.parse(configFile);
    if (!targetPath) {
      throw new Error('targetPath is required in i18n-config.json file.');
    }
    return targetPath;
  }

  async get(): Promise<DB> {
    if (!this.db) await this.initialize();
    return this.db;
  }
}
