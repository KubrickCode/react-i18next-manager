import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common';

class EditLocalesPositionReqBodyLocale {
  @ApiProperty()
  @IsUUID()
  id: UUID;

  @ApiProperty()
  @IsInt()
  position: number;
}

export class EditLocalesPositionReqBodyDto {
  @ApiProperty({ type: [EditLocalesPositionReqBodyLocale] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditLocalesPositionReqBodyLocale)
  locales: EditLocalesPositionReqBodyLocale[];
}
