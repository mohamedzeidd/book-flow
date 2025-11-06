import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './logged-user.interface';
import { RolePermissions } from '../constants/role-permissions.constants';
import { Request } from 'express';
import { Roles } from '../constants/roles.constants';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: any, next: () => void) {
    const authHeader = req.headers['authorization']?.split(' ');
    if (!authHeader || authHeader.length === 0) {
      this.setGuestUser(req);
      return next();
    }

    if (authHeader[0] !== 'Bearer' || !authHeader[1])
      throw new UnauthorizedException(
        'Invalid or missing authorization header',
      );
    const token = authHeader[1];

    const payload: JwtPayload = this.jwtService.verify(token);
    if (!payload)
      throw new UnauthorizedException(
        'Invalid or missing authorization header',
      );

    const allowedPermissions = RolePermissions[payload.role] || [];

    req.loggedUser = {
      id: payload.id,
      role: payload.role,
      isActive: payload.isActive,
      permissions: allowedPermissions,
    };
    next();
  }
  setGuestUser(req: Request) {
    req.loggedUser = {
      role: Roles.GUEST,
      isActive: false,
      permissions: RolePermissions.guest,
    };
  }
}
