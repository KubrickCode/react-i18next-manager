import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsUUID()
  localeId: UUID;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  value: string;
}

export class AddTranslationReqBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Trim()
  key: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationValue)
  values: TranslationValue[];
}

export class AddTranslationReqParamDto {
  @ApiProperty()
  @IsUUID()
  groupId: UUID;
}
