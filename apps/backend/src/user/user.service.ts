import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StripeService } from '../payments/stripe.service';

@Injectable()
export class UserService {
  private readonly prisma = new PrismaClient();

  // ✅ Inject StripeService through the constructor
  constructor(private readonly stripeService: StripeService) {}

  async getUserByClerkId(userId: string): Promise<{
    first_name: string;
    last_name: string;
    email: string;
    subscription: object;
    product: object;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
      select: { stripeId: true },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // ✅ Now stripeService is available
    const subscriptionData = await this.stripeService.getSubscription(
      subscription.stripeId,
    );

    if (!subscriptionData.items.data[0].price.product) {
      throw new NotFoundException('Product not found');
    }

    const productId = subscriptionData.items.data[0].price.product as string;
    const productData = await this.stripeService.getProduct(productId);

    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      subscription: subscriptionData,
      product: productData,
    };
  }
}
