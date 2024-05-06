import { DBService } from "../db/db.service";
import { Service } from "typedi";

@Service()
export class ConfigRepository {
  constructor(private readonly dbService: DBService) {}

  async getGroups() {
    return this.dbService.getGroups();
  }

  async getLanguages() {
    return this.dbService.getLanguages();
  }
}
