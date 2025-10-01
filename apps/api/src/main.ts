import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SupabaseAuthGuard } from './auth/supabase-auth.guard';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000', 'https://propalytiq.netlify.app/'], // your Next.js app
      credentials: true,
    },
  });
  const guard = app.get(SupabaseAuthGuard);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // so @Type(() => Number) works
    }),
  );
  app.useGlobalGuards(guard);
  app.setGlobalPrefix('api');
  // Stripe needs the raw body on its webhook route:
  // app.use('/billing/webhook', raw({ type: '*/*' }));
  // Use normal JSON everywhere else:
  app.use(json());

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
