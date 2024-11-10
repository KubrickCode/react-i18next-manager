import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Trim } from 'src/common/decorator';
import { UUID } from 'src/common';

export class EditLocaleLabelReqParamDto {
  @ApiProperty()
  @IsUUID()
  id: UUID;
}

export class EditLocaleLabelReqBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  newLabel: string;
}
