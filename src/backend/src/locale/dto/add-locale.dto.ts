import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/common/decorator/trim.decorator';

export class AddLocaleReqBodyDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  label: string;

  @IsInt()
  position: number;
}
