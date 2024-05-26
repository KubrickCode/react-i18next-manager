import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Trim } from 'src/common/decorator/trim.decorator';
import { UUID } from 'src/common/types';

class TranslationValue {
  @IsUUID()
  localeId: UUID;

  @IsString()
  @Trim()
  value: string;
}

export class AddTranslationReqBodyDto {
  @IsString()
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
