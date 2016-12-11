import { ExtendedRequest } from './extended-request';
import { Response } from 'express';
import { getMasterContext, IIdentity } from '../data/models';

export function masterContext(req: ExtendedRequest, res: Response, next) {
    getMasterContext().then((ctx) => {
        req.masterContext = ctx;
        next();
    });
}