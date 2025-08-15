import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { StripeService } from '../payments/stripe.service';
import { PrismaService } from 'prisma/prisma.service';
import { createClerkClient } from '@clerk/backend';

// You can store these in env variables
export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService,
  ) {}

  async getUserByClerkId(clerkUserId: string) {
    const user = await this.userRepo.getUserByClerkId(clerkUserId);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      createdAt: user.createdAt,
      clerkUserId: user.clerkUserId,
      email_reports: user.email_reports,
      market_updates: user.market_updates,
      product_updates: user.product_updates,
      security_alerts: user.security_alerts,
      reports: user.reports,
      subscription: user.subscription,
    };
  }

  async updateClerkUser(
    clerkUserId: string,
    dto: { firstName: string; lastName: string; email: string },
  ) {
    // 1. Update first & last name
    await clerkClient.users.updateUser(clerkUserId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // 2. Fetch current email from Clerk
    const user = await clerkClient.users.getUser(clerkUserId);
    const currentEmail = user.primaryEmailAddress?.emailAddress;

    // 3. If email changed
    if (dto.email && dto.email !== currentEmail) {
      // Create the new email address
      const emailAddress = await clerkClient.emailAddresses.createEmailAddress({
        userId: clerkUserId,
        emailAddress: dto.email,
      });

      // You can't trigger verification here in backend — must be done on frontend
      return {
        requiresVerification: true,
        emailAddressId: emailAddress.id,
        message:
          'Email created. Verification must be started from the frontend.',
      };
    }

    return { requiresVerification: false };
  }

  async updateProfileData(
    userId: string,
    dto: { firstName: string; lastName: string; email: string },
  ) {
    const result = await this.updateClerkUser(userId, dto);
    if (result.requiresVerification) return result;

    // Sync to local DB
    await this.prismaService.user.update({
      where: { clerkUserId: userId },
      data: {
        first_name: dto.firstName,
        last_name: dto.lastName,
        email: dto.email,
      },
    });
  }

  async updateEmailAfterVerification(userId: string, email: string) {
    // Double-check with Clerk that this email is verified & primary
    const clerkUser = await clerkClient.users.getUser(userId);

    if (clerkUser.primaryEmailAddress?.emailAddress !== email) {
      throw new BadRequestException('Email not verified in Clerk');
    }

    // Update DB only after verified
    return this.prismaService.user.update({
      where: { clerkUserId: userId },
      data: { email },
    });
  }

  async updateNotificationsData(
    userId: string,
    dto: {
      email_reports: boolean;
      market_updates: boolean;
      product_updates: boolean;
      security_alerts: boolean;
    },
  ) {
    return this.prismaService.user.update({
      where: { clerkUserId: userId },
      data: dto,
    });
  }
}
