import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class DeleteGroupReqParamDto {
  @ApiProperty()
  @IsUUID()
  id: UUID;
}
