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

class GetLocalesResLocale {
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
  @ApiProperty({ type: [GetLocalesResLocale] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetLocalesResLocale)
  locales: GetLocalesResLocale[];
}
