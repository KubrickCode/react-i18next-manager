import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class Translation {
  @IsUUID()
  localeId: UUID;

  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class AddTranslationsReqBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Translation)
  newTranslations: Translation[];
}

export class AddTranslationsReqParamDto {
  @IsUUID()
  groupId: UUID;
}
