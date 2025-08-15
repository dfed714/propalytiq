import { Controller, Get, Patch, Req, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

// Import DTOs from settings module
import type { UpdateProfileDto } from '../settings/dto/update-profile.dto';
import type { UpdateNotificationsDto } from '../settings/dto/update-notifications.dto';

@UseGuards(ClerkAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    const clerkUserId = req.user.sub as string;
    return this.userService.getUserByClerkId(clerkUserId);
  }

  @Patch('me/profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const clerkUserId = req.user.sub as string;
    return this.userService.updateProfileData(clerkUserId, dto);
  }

  @Patch('update-email-after-verification')
  async updateEmailAfterVerification(
    @Req() req,
    @Body() body: { email: string },
  ) {
    const userId = req.auth.userId; // assuming Clerk auth middleware
    return this.userService.updateEmailAfterVerification(userId, body.email);
  }

  @Patch('me/notifications')
  async updateNotifications(
    @Req() req: any,
    @Body() dto: UpdateNotificationsDto,
  ) {
    const clerkUserId = req.user.sub as string;
    return this.userService.updateNotificationsData(clerkUserId, dto);
  }
}
