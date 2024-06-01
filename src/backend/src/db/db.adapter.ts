import { DBService, DB } from './db.service';

export abstract class DBAdapter {
  protected db: DB;

  constructor(protected readonly dbService: DBService) {
    this.initializeDb();
  }

  private async initializeDb() {
    this.db = await this.dbService.get();
  }
}
