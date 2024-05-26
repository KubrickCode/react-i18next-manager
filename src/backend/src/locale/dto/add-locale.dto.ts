import { IsInt, IsString } from 'class-validator';
import { Trim } from 'src/common/decorator/trim.decorator';

export class AddLocaleReqBodyDto {
  @IsString()
  @Trim()
  label: string;

  @IsInt()
  position: number;
}
