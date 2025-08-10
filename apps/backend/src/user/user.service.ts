import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async getUserName(userId: string): Promise<{ userName: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { first_name: true, last_name: true },
    });

    if (!user) {
      return { userName: 'User not found' };
    }

    return { userName: `${user.first_name} ${user.last_name}` };
  }
}
