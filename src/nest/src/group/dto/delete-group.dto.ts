import { IsString } from 'class-validator';

export class DeleteGroupReqParamDto {
  @IsString()
  id: string;
}
