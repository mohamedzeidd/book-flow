import { PERMISSIONS } from './permissions.constants'; 
import { Roles } from './roles.constants';

export const RolePermissions: { [key in Roles]: PERMISSIONS[] } = {
  [Roles.ADMIN]: [
    PERMISSIONS.auth,
    PERMISSIONS.change_password,
    PERMISSIONS.update_phone_number,
    PERMISSIONS.update_profile,
    PERMISSIONS.find_users,

  ],
  [Roles.USER]: [
    PERMISSIONS.auth,
    PERMISSIONS.change_password,
    PERMISSIONS.update_phone_number,
    PERMISSIONS.update_profile,
    PERMISSIONS.find_users,
  ],

  [Roles.GUEST]: [],
//   [Roles.EMPLOYEE]: [],
//   [Roles.SUPERVISOR]: [],
//   [Roles.WORKER]: [],
//   [Roles.CUSTOMER]: [],
//   [Roles.SUPPLIER]: [],
//   [Roles.AGENT]: [],
//   [Roles.WHOLESALER]: [],




};
