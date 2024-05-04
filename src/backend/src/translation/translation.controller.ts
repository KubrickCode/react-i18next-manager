import { Service } from "typedi";
import { TranslationService } from "./translation.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

@Service()
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {
    this.getTranslations = this.getTranslations.bind(this);
  }

  async getTranslations(req: Request, res: Response) {
    const result = await this.translationService.getTranslations();
    res.status(StatusCodes.OK).send(result);
    return result;
  }
}
