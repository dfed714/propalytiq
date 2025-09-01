/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { SupabaseAuthGuard } from '@auth/supabase-auth.guard';
import { AccountService } from './service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('account')
@UseGuards(SupabaseAuthGuard)
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  getMyAccount(@Req() req: any) {
    return this.service.getForUser(req.user.id);
  }

  @Patch('preferences')
  updatePrefs(
    @Req() req: any,
    @Body()
    body: {
      email_reports?: boolean;
      email_market_updates?: boolean;
      email_product_updates?: boolean;
      email_security_updates?: boolean;
    },
  ) {
    return this.service.updateEmailPreferences(req.user.id, body);
  }

  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(req.user.id, dto);
  }
}
