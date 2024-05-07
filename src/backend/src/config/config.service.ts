import { Service } from "typedi";
import { ConfigRepository } from "./config.repository";

@Service()
export class ConfigService {
  constructor(private readonly configRepository: ConfigRepository) {}

  async getConfig(kind: string) {
    switch (kind) {
      case "groups":
        return this.configRepository.getGroups();
      case "languages":
        return this.configRepository.getLanguages();
      default:
        throw new Error("Invalid config kind");
    }
  }

  async getGroups() {
    return this.configRepository.getGroups();
  }

  async getLanguages() {
    return this.configRepository.getLanguages();
  }

  async editGroups(
    body: { id?: number; prevName: string; newName?: string }[]
  ) {
    return this.configRepository.editGroups(body);
  }

  async editConfig(
    kind: string,
    body: { id?: number; prevName: string; newName?: string }[]
  ) {
    switch (kind) {
      case "groups":
        return await this.configRepository.editGroups(body);
      case "languages":
        return await this.configRepository.editLanguages(body);
      default:
        throw new Error("Invalid config kind");
    }
  }

  async deleteConfig(kind: string, name: string) {
    switch (kind) {
      case "groups":
        return await this.configRepository.deleteGroup(name);
      case "languages":
        return await this.configRepository.deleteLanguage(name);
      default:
        throw new Error("Invalid config kind");
    }
  }
}
