import { Injectable, OnModuleInit } from '@nestjs/common';
import * as lowdb from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { join } from 'path';
import { DBSchema } from './db.schema';

export type DB = lowdb.LowdbAsync<DBSchema>;
export type { DBSchema };

@Injectable()
export class DBService implements OnModuleInit {
  private db: DB;

  async onModuleInit() {
    await this.initializeDb();
  }

  private async initializeDb() {
    const file = join(__dirname, 'sample/db.json');
    const adapter = new FileAsync<DBSchema>(file);
    this.db = await lowdb(adapter);
    await this.db.defaults({ locales: [] }).write();
  }

  async getDb(): Promise<DB> {
    if (!this.db) {
      await this.initializeDb();
    }
    return this.db;
  }
}
