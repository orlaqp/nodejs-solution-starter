import * as Promise from 'bluebird';
import connectToMongoDb from '../../mongo-utils';
import { IAppModels } from './app-models';
import { getUserModel } from './users';
import { getRoleModel, getPermissionModel } from '../../../lib/rbac';
import * as winston from 'winston';

export function getContext(dbUri: string): Promise<IAppModels> {
    winston.debug(`Getting app context for: ${dbUri}`);

    return new Promise<IAppModels>((resolve, reject) => {
        connectToMongoDb(dbUri).then((m) => {
            resolve({
                User: getUserModel(m),
                Role: getRoleModel(m),
                Permission: getPermissionModel(m),
            })
        }, (err) => reject(err));
    });
}


