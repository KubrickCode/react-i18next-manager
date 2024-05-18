import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class TranslationValue {
  @IsUUID()
  localeId: UUID;

  @IsString()
  value: string;
}

export class AddTranslationReqBodyDto {
  @IsString()
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
