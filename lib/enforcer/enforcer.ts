import { IIdentity } from '../../data/models';
import { Activity, ActivityCollection } from './activity';
import { IEnforcerConfig } from './enforcer-config';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as logger from  'winston';

export interface IEnforcer {
    authorizationTo(activityName: String, cb: (err: any, authorized: Boolean) => void);
}

export class Enforcer implements IEnforcer {

    private _identity: IIdentity;
    private _config: IEnforcerConfig;

    constructor(config: IEnforcerConfig, identity: IIdentity) {
        if (!config || !identity) {
            throw new Error('An enforcer instance requires config information and an identity');
        }

        this._config = config;
        this._identity = identity;
    }

    authorizationTo(activityName: String, cb: (err: any, authorized: Boolean) => void) {
        logger.debug('Checking allow authorization');
        // first call the global allow and deny callbacks
        if (this._config.allow) {
            this._config.allow(this._identity, activityName, (err, authorized) => {
                if (err || !authorized) {
                    cb(err, authorized);
                    return;
                }
            });
        }

        logger.debug('Checking deny authorization');
        if (this._config.deny) {
            this._config.deny(this._identity, activityName, (err, deny) => {
                if (err || deny) {
                    cb(err, !deny);
                    return;
                }
            });
        }

        logger.debug('Checking activity authorization');
        let activity = _.find(this._config.activities, { may: activityName });

        if (!activity) {
            cb(new Error(`Activity ${activityName} was not found`), false);
            return;
        }

        this._checkAuthorization(activity).then((authorized) => {
            cb(null, authorized);
        }).catch((err) => {
            cb(err, false);
        });
    }

    private _checkAuthorization(activity: Activity): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {

            if (!activity) {
                throw new Error('Cannot check authorization of an empty activity');
            }

            // the when callback has priority over the permissions list
            if (!activity.when && activity.hasPermissions) {
                // check only permissions

                let hasPermission = true;

                activity.hasPermissions.forEach((permission) => {
                    let permissionFound = _.find(this._identity.permissions, {
                        subject: permission.subject,
                        action: permission.action,
                    });

                    if (!permissionFound) {
                        hasPermission = false;
                        return false;
                    }
                });

                if (!hasPermission) {
                    resolve(hasPermission);
                }
            }

            activity.when(this._identity, (err, authorized) => {
                if (err) {
                    throw err;
                }

                resolve(authorized);
            });
        });
    }
}