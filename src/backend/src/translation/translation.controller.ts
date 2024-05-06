import { Service } from "typedi";
import { TranslationService } from "./translation.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export type AddTranslationBody = {
  group: string;
  data: {
    key: string;
    translations: {
      language: string;
      value: string;
    }[];
  };
};

@Service()
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {
    this.getTranslations = this.getTranslations.bind(this);
    this.addTranslation = this.addTranslation.bind(this);
  }

  async getTranslations(req: Request, res: Response) {
    const { group } = req.params;
    const { skip = 0, take = 9999 } = req.query;
    const result = await this.translationService.getTranslations(
      group,
      Number(skip),
      Number(take)
    );
    res.status(StatusCodes.OK).send(result);
    return result;
  }

  async addTranslation(req: Request, res: Response) {
    const body: AddTranslationBody = req.body;
    const result = await this.translationService.addTranslation(body);
    res.status(StatusCodes.CREATED).send();
    return result;
  }
}
