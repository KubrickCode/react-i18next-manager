import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class EditGroupPositionReqParamDto {
  @ApiProperty()
  @IsUUID()
  id: UUID;
}

export class EditGroupPositionReqBodyDto {
  @ApiProperty({ nullable: true })
  @IsUUID()
  @IsOptional()
  parentId: UUID | null;

  @ApiProperty()
  @IsInt()
  position: number;
}
