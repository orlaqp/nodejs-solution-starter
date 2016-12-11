import {
    IIdentity,
    IAppModels,
    IMutation
} from '..';
export interface IMutationBus {

}

export class MutationBus implements IMutationBus {


    private _identity: IIdentity;
    public get identity():  IIdentity {
        return this._identity;
    }

    private _appContext : IAppModels;
    public get appContext(): IAppModels {
        return this._appContext;
    }

    constructor(identity: IIdentity, appContext: IAppModels) {
        if (!identity) {
            throw { message: 'An instance of the MutationBus requires an identity' };
        }

        this._identity = identity;
        this._appContext = appContext;
    }

    run<T>(mutation: IMutation<T>) {

    }

}

