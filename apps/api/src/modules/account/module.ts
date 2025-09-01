import { Module } from '@nestjs/common';
import { AccountController } from './controller';
import { AccountService } from './service';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
