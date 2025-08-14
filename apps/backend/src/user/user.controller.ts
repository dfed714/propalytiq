import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@UseGuards(ClerkAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Get('me')
  async me(@Req() req: any) {
    const clerkUserId = req.user.sub as string;
    return this.user.getUserByClerkId(clerkUserId);
  }
}
