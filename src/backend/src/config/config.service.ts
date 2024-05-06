import { Service } from "typedi";
import { ConfigRepository } from "./config.repository";

@Service()
export class ConfigService {
  constructor(private readonly configRepository: ConfigRepository) {}

  async getGroups() {
    return this.configRepository.getGroups();
  }

  async getLanguages() {
    return this.configRepository.getLanguages();
  }
}
