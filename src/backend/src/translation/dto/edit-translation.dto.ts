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

export class EditTranslationReqBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Trim()
  newKey: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationValue)
  newValues: TranslationValue[];
}

export class EditTranslationReqParamDto {
  @ApiProperty()
  @IsUUID()
  id: UUID;
}
