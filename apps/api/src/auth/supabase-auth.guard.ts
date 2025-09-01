/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase = createClient(
    process.env.SUPABASE_URL!, // e.g. https://abc123.supabase.co
    process.env.SUPABASE_ANON_KEY!, // anon key; safe on server
  );

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!token) throw new UnauthorizedException('Missing bearer token');

    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data?.user)
      throw new UnauthorizedException('Invalid or expired token');

    // attach the verified user
    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: (data.user as any).role ?? null,
    };
    return true;
  }
}
