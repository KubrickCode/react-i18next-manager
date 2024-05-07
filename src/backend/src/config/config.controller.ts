import { Service } from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ConfigService } from "./config.service";

type EditConfigBody = {
  id?: number;
  prevName: string;
  newName?: string;
}[];

@Service()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {
    this.getConfig = this.getConfig.bind(this);
    this.editConfig = this.editConfig.bind(this);
    this.deleteConfig = this.deleteConfig.bind(this);
  }

  async getConfig(req: Request, res: Response) {
    const { kind } = req.params;
    const result = await this.configService.getConfig(kind);
    res.status(StatusCodes.OK).send(result);
    return result;
  }

  async editConfig(req: Request, res: Response) {
    const { kind } = req.params;
    const body: EditConfigBody = req.body;
    const result = await this.configService.editConfig(kind, body);
    res.status(StatusCodes.OK).send(result);
    return result;
  }

  async deleteConfig(req: Request, res: Response) {
    const { kind, name } = req.params;
    const result = await this.configService.deleteConfig(kind, name);
    res.status(StatusCodes.NO_CONTENT).send(result);
    return result;
  }
}
