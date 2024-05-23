import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class TranslationValue {
  @IsUUID()
  localeId: UUID;

  @IsString()
  value: string;
}

class Translation {
  @IsUUID()
  id: UUID;

  @IsUUID()
  groupId: UUID;

  @IsString()
  key: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationValue)
  values: TranslationValue[];
}

export class GetTranslationsResDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Translation)
  translations: Translation[];
}

export class GetTranslationsReqParamDto {
  @IsUUID()
  groupId: UUID;
}
