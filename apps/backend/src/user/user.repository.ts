import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface FullUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: Date;
  clerkUserId: string;
  email_reports: boolean;
  market_updates: boolean;
  product_updates: boolean;
  security_alerts: boolean;
  reports: any[];
  subscription: any;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByClerkId(clerkUserId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { clerkUserId },
      include: {
        reports: true,
        subscription: true,
      },
    }) as FullUser;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
