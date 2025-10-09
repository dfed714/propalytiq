/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// apps/backend/src/modules/contact/controller.ts
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ContactService } from './service';
import type { ContactDto } from '@dtos';
import { SupabaseAuthGuard } from '../../auth/supabase-auth.guard';

@Controller('contact')
@UseGuards(SupabaseAuthGuard) // <- protect with Supabase JWT
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Post()
  @HttpCode(200)
  send(@Req() req: any, @Body() dto: ContactDto) {
    // req.user comes from the guard: { id, email, role? }
    return this.service.send(dto, req.user);
  }
}
