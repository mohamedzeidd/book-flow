import 'express';
import { Roles } from './global/constants/roles.constant';

declare module 'express' {
  export interface Request {
    loggedUser?: {
      id?: string;
      role: Roles;
      isActive: boolean;
      permissions: string[];
    };
  }
}
