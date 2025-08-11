import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users/:id
  @Get(':id')
  async getUserName(@Param('id') id: string) {
    // Pass the string id to the service method
    return this.userService.getUserName(id);
  }
}
