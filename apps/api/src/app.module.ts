// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // point to your monorepo path(s)
      envFilePath: ['apps/backend/.env', '.env', '.env.local'],
    }),
    AccountModule,
  ],
})
export class AppModule {}
