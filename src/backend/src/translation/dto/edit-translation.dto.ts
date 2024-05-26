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

export class EditTranslationReqBodyDto {
  @IsString()
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
