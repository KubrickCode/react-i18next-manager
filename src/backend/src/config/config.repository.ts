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

  async editGroups(
    body: { id?: number; prevName: string; newName?: string }[]
  ) {
    const groups = await this.dbService.getGroups();

    let updatedGroups = [...groups];

    body.forEach((item) => {
      if (item.id !== undefined && item.newName) {
        updatedGroups.push(item.newName);
      } else {
        const index = updatedGroups.findIndex(
          (group) => group === item.prevName
        );
        if (index !== -1 && item.newName) {
          updatedGroups[index] = item.newName;
        }
      }
    });

    await this.dbService.saveGroups(updatedGroups);
    return updatedGroups;
  }

  async deleteGroup(groupName: string) {
    const groups = this.dbService.getGroups();
    const updatedGroups = groups.filter((group) => group !== groupName);
    await this.dbService.saveGroups(updatedGroups);
  }

  async deleteLanguage(languageName: string) {
    const languages = this.dbService.getLanguages();
    const updatedLanguages = languages.filter(
      (language) => language !== languageName
    );
    await this.dbService.saveLanguages(updatedLanguages);
  }
}
