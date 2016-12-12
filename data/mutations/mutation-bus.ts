import { IValidationResult } from './validation-result';
import {
    IIdentity,
    IMasterModels,
    IAppModels,
    IMutation
} from '..';
import { IEnforcer } from '../../lib/enforcer';
import * as Promise from 'bluebird';


export interface IMutationBus {
    run<T>(activityName: string, mutation: IMutation<T>, data: any): Promise<any>;
}

export class MutationBus implements IMutationBus {


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

    run<T>(activityName: string, mutation: IMutation<T>, data: any): Promise<any> {
        // chack activity authorization
        return this.enforcer.authorizationTo(activityName)
            .then((authorized) => {
                if (!authorized) {
                    return Promise.reject(authorized);
                }

                // run the mutation validation
                if (mutation.validate) {
                    return mutation.validate(data);
                }
            })
            .then((result: IValidationResult) => {
                // if it is valid
                if (!result.success) {
                    return Promise.reject(result);
                }

                return Promise.resolve(true);
            })
            .then((validated: boolean) => {
                return mutation.run(data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });

    }
}


