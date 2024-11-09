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
import { UUID } from 'src/common/types';

class Group {
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
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Group)
  groups: Group[];
}
