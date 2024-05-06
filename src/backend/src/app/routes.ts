import { Router } from "express";
import { TranslationRouter } from "../translation/translation.route";
import { Container } from "typedi";
import { ConfigRouter } from "../config/config.route";

export class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use("/translations", Container.get(TranslationRouter).router);
    this.router.use("/config", Container.get(ConfigRouter).router);
  }
}
