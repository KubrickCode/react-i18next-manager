import { Service } from "typedi";
import { TranslationService } from "./translation.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  AddTranslationReqBodyDTO,
  AddTranslationReqParamsDTO,
} from "./dto/add-translation.dto";
import { plainToClass } from "class-transformer";
import {
  GetTranslationsReqParamsDTO,
  GetTranslationsReqQueryDTO,
  GetTranslationsResDTO,
} from "./dto/get-translations.dto";
import { getValidatedResponse } from "../utils/get-validated-response.util";

export type AddTranslationBody = {
  key: string;
  translations: {
    language: string;
    value: string;
  }[];
};

export type EditTranslationBody = {
  newKey: string;
  translations: {
    language: string;
    value: string;
  }[];
};

@Service()
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {
    this.getTranslations = this.getTranslations.bind(this);
    this.addTranslation = this.addTranslation.bind(this);
    this.deleteTranslations = this.deleteTranslations.bind(this);
    this.editTranslation = this.editTranslation.bind(this);
  }

  async getTranslations(req: Request, res: Response) {
    const { group } = plainToClass(GetTranslationsReqParamsDTO, req.params);
    const { skip, take } = plainToClass(GetTranslationsReqQueryDTO, req.query);
    const result = await this.translationService.getTranslations({
      group,
      skip,
      take,
    });
    const response = await getValidatedResponse(GetTranslationsResDTO, result);
    res.status(StatusCodes.OK).send(response);
  }

  async addTranslation(req: Request, res: Response) {
    const { group } = plainToClass(AddTranslationReqParamsDTO, req.params);
    const { key, translations } = plainToClass(
      AddTranslationReqBodyDTO,
      req.body
    );
    await this.translationService.addTranslation({
      group,
      key,
      translations,
    });
    res.status(StatusCodes.CREATED).send();
  }

  async deleteTranslations(req: Request, res: Response) {
    const { group, keys } = req.params;
    Promise.all(
      keys
        .split(",")
        .map((key) => this.translationService.deleteTranslation(group, key))
    );
    res.status(StatusCodes.NO_CONTENT).send();
  }

  async editTranslation(req: Request, res: Response) {
    const body: EditTranslationBody = req.body;
    const { group, key } = req.params;
    const result = await this.translationService.editTranslation(
      group,
      key,
      body
    );
    res.status(StatusCodes.OK).send();
    return result;
  }
}
