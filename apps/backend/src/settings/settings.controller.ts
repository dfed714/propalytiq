// settings/settings.controller.ts
import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import * as currentUserDecorator from '../auth/current-user.decorator';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import type { UpdateNotificationsDto } from './dto/update-notifications.dto';
import type { UpdatePasswordDto } from './dto/update-password.dto';

@UseGuards(ClerkAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@Req() req) {
    const clerkUserId = req.user.sub as string;
    return this.settingsService.getSettingsData(clerkUserId);
  }

  @Patch('profile')
  updateProfile(
    @currentUserDecorator.CurrentUser() user: currentUserDecorator.AuthUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.settingsService.updateProfile(user.sub, dto);
  }

  @Patch('notifications')
  updateNotifications(
    @currentUserDecorator.CurrentUser() user: currentUserDecorator.AuthUser,
    @Body() dto: UpdateNotificationsDto,
  ) {
    return this.settingsService.updateNotifications(user.sub, dto);
  }
}
