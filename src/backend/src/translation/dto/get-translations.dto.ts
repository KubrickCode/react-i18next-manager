import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common';

class GetTranslationsResTranslationValue {
  @ApiProperty()
  @IsUUID()
  localeId: UUID;

  @ApiProperty()
  @IsString()
  value: string;
}

class GetTranslationsResTranslation {
  @ApiProperty()
  @IsUUID()
  id: UUID;

  @ApiProperty()
  @IsUUID()
  groupId: UUID;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty({ type: [GetTranslationsResTranslationValue] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetTranslationsResTranslationValue)
  values: GetTranslationsResTranslationValue[];
}

export class GetTranslationsResDto {
  @ApiProperty({ type: [GetTranslationsResTranslation] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetTranslationsResTranslation)
  translations: GetTranslationsResTranslation[];
}

export class GetTranslationsReqParamDto {
  @ApiProperty()
  @IsUUID()
  groupId: UUID;
}
