import { IsString } from 'class-validator';

export class DeleteLocaleReqParamDto {
  @IsString()
  id: string;
}
