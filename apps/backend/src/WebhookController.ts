import { Controller, Post, Req, Res, HttpCode } from '@nestjs/common';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ClerkUserCreatedEvent {
  type: 'user.created';
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses?: Array<{ email_address: string }>;
  };
}

@Controller('webhooks')
export class WebhookController {
  @Post('clerk')
  @HttpCode(200)
  async handleClerkWebhook(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    // Explicitly cast req.body to our interface
    const event = req.body as ClerkUserCreatedEvent;

    if (event.type === 'user.created') {
      const clerkUser = event.data;
      const { id, first_name, last_name, email_addresses } = clerkUser;

      const email = email_addresses?.[0]?.email_address || null;

      if (!email) {
        console.error('User creation skipped: no email provided');
        res.status(400).send('Email required');
        return;
      }

      try {
        await prisma.user.create({
          data: {
            first_name,
            last_name,
            email,
            clerkUserId: id,
          },
        });
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }

    res.send('Webhook processed');
  }
}
