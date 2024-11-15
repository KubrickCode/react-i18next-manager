import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, NotContains } from 'class-validator';
import { Trim } from 'src/common/decorator';
import { UUID } from 'src/common';

export class EditGroupLabelReqParamDto {
  @ApiProperty()
  @IsUUID()
  id: UUID;
}

export class EditGroupLabelReqBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Trim()
  newLabel: string;
}
