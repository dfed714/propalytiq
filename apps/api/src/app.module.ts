// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account/module';
import { AiModule } from '@modules/ai/module';
import { ReportModule } from '@modules/report/module';
import { ContactModule } from '@modules/contact/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // point to your monorepo path(s)
      envFilePath: ['apps/api/.env', '.env', '.env.local'],
    }),
    AccountModule,
    AiModule,
    ReportModule,
    ContactModule,
  ],
})
export class AppModule {}
