import { ExtendedRequest } from './extended-request';
import { Response } from 'express';

/**
 * Middle responsible to attach the mutation bus to 
 * the current request
 */
export function queryBus(req: ExtendedRequest, res: Response, next) {
    next();
}