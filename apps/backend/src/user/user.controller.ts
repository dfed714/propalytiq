import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@UseGuards(ClerkAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get('me')
  async me(@Req() req: any) {
    const clerkId = req.user.sub as string;
    return this.users.getUserByClerkId(clerkId);
  }
}
