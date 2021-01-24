import {IAuthUser} from 'loopback4-authentication';

export interface IAuthUserWithPermissions<
  ID = string,
  TID = string,
  UTID = string
> extends IAuthUser {
  id?: string;
  identifier?: ID;
  permissions: string[];
  authClientId: number;
  email?: string;
  role: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  tenantId?: TID;
  userTenantId?: UTID;
  passwordExpiryTime?: Date;
  allowedResources?: string[];
}
