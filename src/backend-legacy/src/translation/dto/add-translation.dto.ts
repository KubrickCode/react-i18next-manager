import {
  IsString,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

export class AddTranslationReqParamsDTO {
  @IsString()
  readonly group: string;
}

export class AddTranslationReqBodyDTO {
  @IsString()
  readonly key: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  readonly translations: TranslationDto[];
}

class TranslationDto {
  @IsString()
  readonly language: string;

  @IsString()
  readonly value: string;
}
