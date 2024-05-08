import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";

export const getValidatedResponse = async <T extends object>(
  schema: { new (): T },
  result: any
): Promise<T> => {
  const target = plainToClass(schema, result);
  await validateOrReject(target);
  return target;
};
