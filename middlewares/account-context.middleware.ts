import { ExtendedRequest } from './extended-request';
import { Response } from 'express';
import { getContext, IIdentity } from '../data/models';
import * as winston from 'winston';

export function accountContext(req: ExtendedRequest, res: Response, next) {
    // if the request contains an identity then create the context
    // otherwise, do nothing
    if (req.identity) {
        winston.debug('Processing user identity');
        let identity = <IIdentity>req.identity;
        getContext(<string>identity.dbUri).then((ctx) => {
            req.appContext = ctx;
            next();
        });
    } else {
        next();
    }

}