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

export class EditTranslationReqBodyDto {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Trim()
  newKey: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationValue)
  newValues: TranslationValue[];
}

export class EditTranslationReqParamDto {
  @IsUUID()
  id: UUID;
}
