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
  @IsUUID()
  id: UUID;

  @IsString()
  label: string;

  @IsInt()
  position: number;
}

export class GetLocalesResDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Locale)
  locales: Locale[];
}
