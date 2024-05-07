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
    this.getGroups = this.getGroups.bind(this);
    this.editGroups = this.editGroups.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);

    this.getLanguages = this.getLanguages.bind(this);
  }

  async editGroups(req: Request, res: Response) {
    const body: EditGroupBody = req.body;
    const result = await this.configService.editGroups(body);
    res.status(StatusCodes.OK).send(result);
    return result;
  }

  async deleteGroup(req: Request, res: Response) {
    const { groupName } = req.params;
    const result = await this.configService.deleteGroup(groupName);
    res.status(StatusCodes.NO_CONTENT).send(result);
    return result;
  }

  async getGroups(req: Request, res: Response) {
    const result = await this.configService.getGroups();
    res.status(StatusCodes.OK).send(result);
    return result;
  }

  async getLanguages(req: Request, res: Response) {
    const result = await this.configService.getLanguages();
    res.status(StatusCodes.OK).send(result);
    return result;
  }
}
