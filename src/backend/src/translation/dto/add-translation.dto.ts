import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  NotContains,
  ValidateNested,
} from 'class-validator';
import { Trim } from 'src/common/decorator/trim.decorator';
import { UUID } from 'src/common/types';

class TranslationValue {
  @IsUUID()
  localeId: UUID;

  @IsString()
  @IsNotEmpty()
  @Trim()
  value: string;
}

export class AddTranslationReqBodyDto {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Trim()
  key: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationValue)
  values: TranslationValue[];
}

export class AddTranslationReqParamDto {
  @IsUUID()
  groupId: UUID;
}
