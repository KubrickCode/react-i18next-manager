import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

class Locale {
  @IsString()
  id: string;

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
