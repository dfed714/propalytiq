import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WebhookController } from './WebhookController';

@Module({
  imports: [UserModule],
  controllers: [AppController, WebhookController],
  providers: [AppService],
})
export class AppModule {}
