import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class TranslationValue {
  @IsUUID()
  localeId: UUID;

  @IsString()
  value: string;
}

export class EditTranslationReqBodyDto {
  @IsString()
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
