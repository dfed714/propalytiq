// apps/backend/src/modules/ai/module.ts
import { Module } from '@nestjs/common';
import { AiService } from './service';
import { AiController } from './controller';

@Module({
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService], // <- so other modules can use AiService
})
export class AiModule {}
