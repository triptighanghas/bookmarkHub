import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // authenticate normally
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (err) {
      // authentication fails (no or invalid token), still allow access
      return true;
    }
  }

  handleRequest(err: any, user: any) {
    // If token is valid → user will be set, else user is null
    return user || null;
  }
}
