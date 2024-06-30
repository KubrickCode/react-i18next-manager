import { IsNotEmpty, IsString, IsUUID, NotContains } from 'class-validator';
import { Trim } from 'src/common/decorator/trim.decorator';
import { UUID } from 'src/common/types';

export class EditGroupLabelReqParamDto {
  @IsUUID()
  id: UUID;
}

export class EditGroupLabelReqBodyDto {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Trim()
  newLabel: string;
}
