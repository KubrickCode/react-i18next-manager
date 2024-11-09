import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'src/common/types';

class Locale {
  @ApiProperty()
  @IsUUID()
  id: UUID;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsInt()
  position: number;
}

export class GetLocalesResDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Locale)
  locales: Locale[];
}
