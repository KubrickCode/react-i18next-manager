import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

class Group {
  @IsString()
  id: string;

  @IsString()
  label: string;

  @IsInt()
  position: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Group)
  children: Group[];
}

export class GetGroupsResDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Group)
  groups: Group[];
}
