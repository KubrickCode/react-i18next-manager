import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Trim } from 'src/common/decorator/trim.decorator';
import { UUID } from 'src/common/types';

export class EditLocaleLabelReqParamDto {
  @IsUUID()
  id: UUID;
}

export class EditLocaleLabelReqBodyDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  newLabel: string;
}
