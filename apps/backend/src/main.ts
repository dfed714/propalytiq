import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json());

  app.enableCors({
    origin: 'http://localhost:3000', // allow your Next.js frontend
    credentials: true, // allow cookies/auth headers if needed
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(4000);
}

void bootstrap();
