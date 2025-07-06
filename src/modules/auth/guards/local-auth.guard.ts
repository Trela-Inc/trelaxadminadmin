import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local Authentication Guard
 * Used for username/password authentication
 * Typically used for login endpoints
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
