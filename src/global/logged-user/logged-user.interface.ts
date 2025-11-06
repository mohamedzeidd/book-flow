import { Roles } from '../constants/roles.constants';

export interface JwtPayload {
  id: string;
  role: Roles;
  isActive: boolean;
}

export interface LoggedUser {
  id?: string;
  role: Roles;
  isActive: boolean;
}
