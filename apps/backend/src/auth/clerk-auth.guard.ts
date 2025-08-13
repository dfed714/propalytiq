// apps/backend/src/auth/clerk.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

const EXPECTED_AUD = process.env.CLERK_EXPECTED_AUD ?? 'backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<{ headers: Record<string, string>; user?: any }>();
    const authHeader = req.headers['authorization'] ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) throw new UnauthorizedException('Missing Authorization header');

    try {
      const claims = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY, // or jwtKey
        audience: EXPECTED_AUD, // must match your Clerk template
        clockSkewInMs: 10_000,
      });
      req.user = claims; // claims.sub is Clerk user id
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
