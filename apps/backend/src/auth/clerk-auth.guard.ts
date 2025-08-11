import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { requireAuth } from '@clerk/express';
import type { Request, Response } from 'express';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    try {
      await new Promise<void>((resolve, reject) => {
        requireAuth()(req, res, (err) => {
          if (err) {
            if (err instanceof Error) {
              reject(err);
            } else {
              reject(new Error(String(err)));
            }
          } else {
            resolve();
          }
        });
      });
      return true;
    } catch {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
