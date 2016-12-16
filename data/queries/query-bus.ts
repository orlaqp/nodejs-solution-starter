// import { IValidationResult } from './validation-result';
import {
    IIdentity,
    IMasterModels,
    IAppModels,
    IQuery
} from '..';
import { IEnforcer } from '../../lib/enforcer';
import * as Promise from 'bluebird';


export interface IQueryBus {
    run<T>(activityName: string, query: IQuery<T>, data: any): Promise<any>;
}

export class QueryBus implements IQueryBus {
    private _enforcer: IEnforcer;
    public get enforcer():  IEnforcer {
        return this._enforcer;
    }

    private _masterContext: IMasterModels;
    public get masterContext(): IMasterModels {
        return this._masterContext;
    }

    private _appContext: IAppModels;
    public get appContext(): IAppModels {
        return this._appContext;
    }

    constructor(
        enforcer: IEnforcer,
        masterContext: IMasterModels,
        appContext: IAppModels) {
            this._enforcer = enforcer;
            this._masterContext = masterContext;
            this._appContext = appContext;
    }

    run<T>(activityName: string, query: IQuery<T>, data: any): Promise<any> {
        console.log('running query get-account');
        // chack activity authorization
        return this.enforcer.authorizationTo(activityName)
            .then((authorized) => {
                if (!authorized) {
                    return Promise.reject(authorized);
                }

                return Promise.resolve(true);
            })
            .then((authorized: boolean) => {
                if (authorized) {
                    console.log('trying to run query');
                    return query.run(data);
                }
            })
            .catch((err) => {
                return Promise.reject(err);
            });

    }
}


