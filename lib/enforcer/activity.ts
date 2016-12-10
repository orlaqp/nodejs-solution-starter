import * as _ from 'lodash';
import { IIdentity } from '../../data/models';
import { IPermission } from '../rbac'
import * as Promise from 'bluebird';

/** 
 * Defines the data returned when an activity is validated before its execution
 */
export interface IValidationResult {
    errors: any;
    success: boolean;
}

/** 
 * This interface represents an activity definition.
 * An activity is a way to define a set of rules for validation authorization and implementation
 * of a specific task
*/
export interface Activity<T> {

    /** 
     * Activity name
     * */
    name: string;

    /** 
     * An optional description for your activity
     * @optional
     */
    description?: string;

    /**
     * A set of permissions required by the user who is executing the activity
     */
    hasPermissions?: IPermission[];

    /**
     * If you require a complex authorization mechanism for an activity
     * that goes beyond permissions you can use this method to specify your rules.
     * This method can be as complex as you need it to be, just make sure you return a promise
     */
    when?(identity: IIdentity, cb: (err: any, authorized: Boolean) => void);

    /**
     * Method called only when authorization is succesful to validate 
     * if the input data for the activity is valid
     */
    validate(): Promise<IValidationResult>

    /**
     * Executes the logic for this activity
     */
    execute(): Promise<T>;

    /**
     * Specifies if an attempt to execute this activity should be logged
     */
    log: boolean;

    /**
     * Specifies if the changes on this activity should be audit and saved
     * to the database so the changes can audited at a later time
     */
    audit: boolean;
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