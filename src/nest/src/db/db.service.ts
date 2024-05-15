import { Injectable, OnModuleInit } from '@nestjs/common';
import * as lowdb from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { join } from 'path';
import { LocaleData } from './db.schema';

export type LocaleDB = lowdb.LowdbAsync<LocaleData>;

@Injectable()
export class DBService implements OnModuleInit {
  private db: LocaleDB;

  async onModuleInit() {
    await this.initializeDb();
  }

  private async initializeDb() {
    const file = join(__dirname, 'sample/locale.json');
    const adapter = new FileAsync<LocaleData>(file);
    this.db = await lowdb(adapter);
    await this.db.defaults({ locales: [] }).write();
  }

  async getDb(): Promise<LocaleDB> {
    if (!this.db) {
      await this.initializeDb();
    }
    return this.db;
  }
}
