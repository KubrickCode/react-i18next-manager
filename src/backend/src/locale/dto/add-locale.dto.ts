import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/common/decorator/trim.decorator';

export class AddLocaleReqBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  label: string;
}
