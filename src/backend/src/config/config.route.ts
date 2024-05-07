import { Router } from "express";
import { Container, Service } from "typedi";
import { ConfigController } from "./config.controller";

@Service()
export class ConfigRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/groups", Container.get(ConfigController).getGroups);
    this.router.put("/groups", Container.get(ConfigController).editGroups);
    this.router.delete(
      "/groups/:groupName",
      Container.get(ConfigController).deleteGroup
    );

    this.router.get("/languages", Container.get(ConfigController).getLanguages);
  }
}
