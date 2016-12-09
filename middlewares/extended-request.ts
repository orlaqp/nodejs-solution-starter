import { Request } from 'express';
import { IAppModels, IMasterModels } from '../data/models';
import * as winston from 'winston';

export interface ExtendedRequest extends Request {
    identity: any;
    masterContext: IMasterModels;
    appContext: IAppModels;
    logger: winston.LoggerInstance;
}