import { MutationBus } from '../data';
import { ExtendedRequest } from './extended-request';
import { Response } from 'express';

/**
 * Middle responsible to attach the mutation bus to 
 * the current request
 */
export function mutationBus(req: ExtendedRequest, res: Response, next) {

    // the mutation only make sense when an identity is present
    if (!req.identity || !req.appContext) {
        next();
        return;
    }

    req.mutationBus = new MutationBus(req.identity, req.appContext);

}