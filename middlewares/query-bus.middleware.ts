import { QueryBus } from '../data';
import { ExtendedRequest } from './extended-request';
import { Response } from 'express';
import { getEnforcerConfig, Enforcer } from '../lib/enforcer';

/**
 * Middle responsible to attach the mutation bus to 
 * the current request
 */
export function queryBus(req: ExtendedRequest, res: Response, next) {
    let enforcer = new Enforcer(getEnforcerConfig(), req.identity);

    req.queryBus = new QueryBus(enforcer, req.masterContext, req.appContext);
    next();
}