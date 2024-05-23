import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class Locale {
  @IsUUID()
  id: UUID;

  @IsInt()
  position: number;
}

export class EditLocalesPositionReqBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Locale)
  locales: Locale[];
}
