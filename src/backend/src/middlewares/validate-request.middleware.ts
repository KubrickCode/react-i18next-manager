import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { RequestDataKind } from "../enum";
import { Service } from "typedi";

@Service()
export class ValidateRequest {
  validate(schema: { new (): any }, requestDataKind: RequestDataKind) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const target = plainToClass(schema, req[requestDataKind]);
      try {
        await validateOrReject(target);
        next();
      } catch (err) {
        next(err);
      }
    };
  }
}
