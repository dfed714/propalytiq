// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account/module';
import { AiModule } from '@modules/ai/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // point to your monorepo path(s)
      envFilePath: ['apps/api/.env', '.env', '.env.local'],
    }),
    AccountModule,
    AiModule,
  ],
})
export class AppModule {}
