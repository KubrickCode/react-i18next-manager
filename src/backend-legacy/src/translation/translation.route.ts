import { Router } from "express";
import { Container, Service } from "typedi";
import { TranslationController } from "./translation.controller";
import { ValidateRequest } from "../middlewares/validate-request.middleware";
import {
  AddTranslationReqBodyDTO,
  AddTranslationReqParamsDTO,
} from "./dto/add-translation.dto";
import { RequestDataKind } from "../enum";
import {
  GetTranslationsReqParamsDTO,
  GetTranslationsReqQueryDTO,
} from "./dto/get-translations.dto";

@Service()
export class TranslationRouter {
  public router: Router;

  constructor(private readonly validateRequest: ValidateRequest) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get(
      "/:group",
      this.validateRequest.validate(
        GetTranslationsReqParamsDTO,
        RequestDataKind.PARAMS
      ),
      this.validateRequest.validate(
        GetTranslationsReqQueryDTO,
        RequestDataKind.QUERY
      ),
      Container.get(TranslationController).getTranslations
    );
    this.router.post(
      "/:group",
      this.validateRequest.validate(
        AddTranslationReqParamsDTO,
        RequestDataKind.PARAMS
      ),
      this.validateRequest.validate(
        AddTranslationReqBodyDTO,
        RequestDataKind.BODY
      ),
      Container.get(TranslationController).addTranslation
    );
    this.router.delete(
      "/:group/:keys",
      Container.get(TranslationController).deleteTranslations
    );
    this.router.put(
      "/:group/:key",
      Container.get(TranslationController).editTranslation
    );
  }
}
