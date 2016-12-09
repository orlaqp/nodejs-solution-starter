import * as express from 'express';
import { Request, Response } from 'express';
import { AuthController } from '../controllers';
import { getMasterContext } from '../data/models';
import { ExtendedRequest } from '../middlewares';

const auth = express.Router();

auth.post('/token', function authenticate(req: ExtendedRequest, res: Response) {
    getMasterContext().then((masterContext) => {
        let hostname = this._getHostname(req);

        let authManager = new AuthController(masterContext.Account, req.appContext);
        authManager.authenticateUser(hostname, req.body.username, req.body.password)
            .then((token) => {
                res.status(200).json({ token: token });
            }, (err) => {
                res.status(err.status).json({ error: err.message })
            });
    });
});

function _getHostname(req: Request): String {
    // check host value from body
    let hostname: String = req.body.host || req.hostname;

    // stop if not host have been passed
    if (!hostname)
        return null;

    let hostTokens = hostname.split('.');

    // make sure that we have at least 4 tokens, otherwise there is not a subdomain
    return hostTokens.length !== 3 ? null : hostname;
}

export { auth };
