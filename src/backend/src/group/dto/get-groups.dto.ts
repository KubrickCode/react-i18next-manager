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
  @IsUUID()
  id: UUID;

  @IsString()
  label: string;

  @IsUUID()
  @IsOptional()
  parentId: UUID | null;

  @IsInt()
  position: number;
}

export class GetGroupsResDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Group)
  groups: Group[];
}
