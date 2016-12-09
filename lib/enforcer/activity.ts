import * as _ from 'lodash';
import { IIdentity } from '../../data/models';
import { IPermission } from '../rbac'

export interface Activity {
    may: String;
    hasPermissions?: IPermission[];
    when?(identity: IIdentity, cb: (err: any, authorized: Boolean) => void);
}

export class ActivityCollection {
    private _activities: Activity[];

    add(activity: Activity): void {
        if (!activity) {
            throw { message: 'Activity cannot be null' }
        }

        this._activities.push(activity);
    }

    remove(activity: Activity) {
        _.remove(this._activities, (a) => { return a === activity; });
    }
}