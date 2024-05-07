import { Service } from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ConfigService } from "./config.service";

type EditGroupBody = {
  id?: number;
  prevName: string;
  newName?: string;
}[];

@Service()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {
    this.getConfig = this.getConfig.bind(this);
    this.editGroups = this.editGroups.bind(this);
    this.deleteConfig = this.deleteConfig.bind(this);
  }

  async getConfig(req: Request, res: Response) {
    const { kind } = req.params;
    const result = await this.configService.getConfig(kind);
    res.status(StatusCodes.OK).send(result);
    return result;
  }

  async editGroups(req: Request, res: Response) {
    const body: EditGroupBody = req.body;
    const result = await this.configService.editGroups(body);
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
