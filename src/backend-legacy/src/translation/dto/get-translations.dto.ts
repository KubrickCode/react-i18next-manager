import {
  IsNumber,
  IsBoolean,
  IsObject,
  IsString,
  ValidateNested,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";

export class GetTranslationsReqParamsDTO {
  @IsString()
  readonly group: string;
}

export class GetTranslationsReqQueryDTO {
  @IsInt()
  readonly skip: number = 0;

  @IsInt()
  readonly take: number = 9999;
}

export class TranslationValueDto {
  @IsString()
  value: string;
}

export class TranslationsDto {
  [language: string]: TranslationValueDto;
}

export class GetTranslationsResDTO {
  @IsObject()
  @ValidateNested()
  @Type(() => TranslationsDto)
  translations: TranslationsDto;

  @IsNumber()
  count: number;

  @IsBoolean()
  hasPrevPage: boolean;

  @IsBoolean()
  hasNextPage: boolean;
}
