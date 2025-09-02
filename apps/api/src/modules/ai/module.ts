import { Module } from '@nestjs/common';
import { AiController } from './controller';
import { AiService } from './service';

@Module({
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
