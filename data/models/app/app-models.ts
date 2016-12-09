import { IUserModel } from './users';
import { IRoleModel, IPermissionModel } from '../../../lib/rbac';

export interface IAppModels {
    User: IUserModel;
    Role: IRoleModel;
    Permission: IPermissionModel;
}