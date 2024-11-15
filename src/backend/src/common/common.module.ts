import { Module } from '@nestjs/common';
import { DBModule } from 'src/db';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  imports: [DBModule],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
