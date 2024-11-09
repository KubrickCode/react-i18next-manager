import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class TranslationValue {
  @ApiProperty()
  @IsUUID()
  localeId: UUID;

  @ApiProperty()
  @IsString()
  value: string;
}

class Translation {
  @ApiProperty()
  @IsUUID()
  id: UUID;

  @ApiProperty()
  @IsUUID()
  groupId: UUID;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationValue)
  values: TranslationValue[];
}

export class GetTranslationsResDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Translation)
  translations: Translation[];
}

export class GetTranslationsReqParamDto {
  @ApiProperty()
  @IsUUID()
  groupId: UUID;
}
