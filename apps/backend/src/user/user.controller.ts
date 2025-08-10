import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users/:id
  @Get(':id')
  async getUserName(@Param('id') id: string) {
    // Pass the string id to the service method
    return this.userService.getUserName(id);
  }
}
