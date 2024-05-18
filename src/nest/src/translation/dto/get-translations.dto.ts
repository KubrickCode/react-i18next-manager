import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class Translation {
  @IsUUID()
  id: UUID;

  @IsUUID()
  localeId: UUID;

  @IsUUID()
  groupId: UUID;

  @IsString()
  key: string;

  @IsString()
  value: string;
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
