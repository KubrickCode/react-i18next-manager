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
    this.router.get("/", Container.get(TranslationController).getTranslations);
    this.router.post("/", Container.get(TranslationController).addTranslation);
  }
}
