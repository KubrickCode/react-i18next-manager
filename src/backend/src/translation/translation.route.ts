import { Router } from "express";
import { Container, Service } from "typedi";
import { TranslationController } from "./translation.controller";

@Service()
export class TranslationRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get(
      "/:group",
      Container.get(TranslationController).getTranslations
    );
    this.router.post(
      "/:group",
      Container.get(TranslationController).addTranslation
    );
    this.router.delete(
      "/:group/:keys",
      Container.get(TranslationController).deleteTranslations
    );
  }
}
