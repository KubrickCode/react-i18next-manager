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

  async editGroups(body: { prevName: string; newName?: string }[]) {
    const groups = this.dbService.getGroups();

    const updatedGroups = groups.map((group) => {
      const found = body.find((item) => item.prevName === group);
      if (found && found.newName) {
        return found.newName;
      }
      return group;
    });

    await this.dbService.saveGroups(updatedGroups);
    return updatedGroups;
  }
}
