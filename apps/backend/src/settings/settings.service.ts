// settings/settings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly userService: UserService) {}

  async getSettingsData(clerkId: string) {
    const user = await this.userService.getUserByClerkId(clerkId);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      email_reports: user.email_reports,
      market_updates: user.market_updates,
      product_updates: user.product_updates,
      security_alerts: user.security_alerts,
    };
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.userService.updateProfileData(
      userId,
      dto,
    );
  }

  updateNotifications(userId: string, dto: UpdateNotificationsDto) {
    return this.userService.updateNotificationsData(userId, dto);
  }
}
