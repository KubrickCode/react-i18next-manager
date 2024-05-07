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

  async deleteGroup(groupName: string) {
    return this.configRepository.deleteGroup(groupName);
  }
}
