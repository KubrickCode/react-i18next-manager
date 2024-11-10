import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UUID } from 'src/common';

export class DeleteLocaleReqParamDto {
  @ApiProperty()
  @IsUUID()
  id: UUID;
}
