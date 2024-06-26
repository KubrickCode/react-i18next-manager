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
    this.router.get("/:kind", Container.get(ConfigController).getConfig);
    this.router.put("/:kind", Container.get(ConfigController).editConfig);
    this.router.delete(
      "/:kind/:name",
      Container.get(ConfigController).deleteConfig
    );
  }
}
