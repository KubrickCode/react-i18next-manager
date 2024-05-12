import { DBService, Group } from "../db/db.service";
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
    const originalGroups = this.dbService.getGroups();

    const updateGroups = (
      groups: Group[],
      body: { prevName: string; newName?: string }[]
    ): Group[] => {
      return groups.map((group) => {
        const bodyItem = body.find((item) => item.prevName === group.key);
        if (bodyItem && bodyItem.newName) {
          return { ...group, key: bodyItem.newName };
        } else if (group.children) {
          return { ...group, children: updateGroups(group.children, body) };
        }
        return group;
      });
    };

    const updatedGroups = updateGroups(originalGroups, body);

    await this.dbService.saveGroups(updatedGroups);
    return updatedGroups;
  }

  async editLanguages(
    body: { id?: number; prevName: string; newName?: string }[]
  ) {
    const languages = this.dbService.getLanguages();

    let updatedLanguages = [...languages];

    body.forEach((item) => {
      if (item.id !== undefined && item.newName) {
        updatedLanguages.push(item.newName);
      } else {
        const index = updatedLanguages.findIndex(
          (language) => language === item.prevName
        );
        if (index !== -1 && item.newName) {
          updatedLanguages[index] = item.newName;
        }
      }
    });

    await this.dbService.saveLanguages(updatedLanguages);
    return updatedLanguages;
  }

  async deleteGroup(groupName: string) {
    const originalGroups = this.dbService.getGroups();

    const filterGroups = (groups: Group[]): Group[] => {
      return groups
        .filter((group) => group.key !== groupName)
        .map((group) =>
          group.children
            ? { ...group, children: filterGroups(group.children) }
            : group
        );
    };

    const updatedGroups = filterGroups(originalGroups);

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
