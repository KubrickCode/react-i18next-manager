import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'src/common';

class GetGroupsResGroup {
  @ApiProperty()
  @IsUUID()
  id: UUID;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  parentId: UUID | null;

  @ApiProperty()
  @IsInt()
  position: number;
}

export class GetGroupsResDto {
  @ApiProperty({ type: [GetGroupsResGroup] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetGroupsResGroup)
  groups: GetGroupsResGroup[];
}
