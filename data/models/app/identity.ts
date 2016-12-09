import { IPermission, IRole } from '../../../lib/rbac';

export interface IIdentity {
    firstName: String;
    middleName: String;
    lastName: String;
    username: String;
    roles: [IRole];
    permissions: [IPermission];
    dbUri: String;
}