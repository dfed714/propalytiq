// apps/backend/src/modules/contact/module.ts
import { Module } from '@nestjs/common';
import { ContactController } from './controller';
import { ContactService } from './service';
import { MailerProvider } from './mailer.provider';

@Module({
  controllers: [ContactController],
  providers: [ContactService, MailerProvider],
})
export class ContactModule {}
