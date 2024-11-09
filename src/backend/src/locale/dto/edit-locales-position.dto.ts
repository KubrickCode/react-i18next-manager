import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class Locale {
  @ApiProperty()
  @IsUUID()
  id: UUID;

  @ApiProperty()
  @IsInt()
  position: number;
}

export class EditLocalesPositionReqBodyDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Locale)
  locales: Locale[];
}
