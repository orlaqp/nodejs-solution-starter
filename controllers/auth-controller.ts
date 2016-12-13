import * as Promise from 'bluebird';
import * as jwt from 'jsonwebtoken';
import * as winston from 'winston';
import { config } from '../config';
import connectToMongoDb from '../data/mongo-utils';
import {
    IAccountModel,
    IAccountDocument,
    IUserDocument,
    IIdentity,
    IAppModels } from '../data/models';

export class AuthController {
    status: string = 'intial value';

    constructor(private _Account: IAccountModel, private _appContext: IAppModels) { }

    authenticateUser(hostname: String, username: String, password: String): Promise<String> {
        let that = this;

        return new Promise<String>((resolve, reject) => {
            if (!hostname) {
                throw { status: 400, message: 'Invalid hostname' };
            }

            if (!username || !password) {
                throw { status: 400, message: 'Username or password missing' };
            }

            let account: IAccountDocument;
            let user: IUserDocument;

            this._Account.findAccountByHostname(hostname)
                .then((acct: IAccountDocument) => {
                    account = acct;
                    return that._retrieveUser(username);
                })
                .then((u: IUserDocument) => {
                    user = u;
                    return that._validateCredentials(u, password);
                })
                .then(() => {
                    return that._generateIdentity(account, user);
                })
                .then((identity: IIdentity) => {
                    return that._generateToken(identity);
                })
                .then((token: string) => {
                    // return token to the user
                    resolve(token);
                })
                .catch((err) => {
                    winston.error('Error generating user token: ', err);
                    reject(err);
                });
        });
    }

    private _retrieveUser(username: String): Promise<IUserDocument> {
        return new Promise<IUserDocument>((resolve, reject) => {
            this._appContext.User
                .findOne({ username: username })
                .populate('roles', ['name'])
                .then((user) => resolve(user)
                , (err) => { throw err });
        });
    }

    private _validateCredentials(user: IUserDocument, password): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!user) {
                throw { status: 404, message: 'User not found' };
            }

            winston.debug('Validating credentials for: ' + user.firstName);

            return user.comparePassword(password)
                ? resolve(true) : reject(false);
        });
    }

    private _generateIdentity(account: IAccountDocument, user: IUserDocument): Promise<IIdentity> {
        return new Promise<IIdentity>((resolve, reject) => {
            let userSignature: IIdentity = {
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                username: user.username,
                // roles: [''], // user.roles,
                // permissions: ['p1', 'p2'],
                dbUri: account.getConnectionString()
            };

            resolve(userSignature);
        });
    }

    private _generateToken(identity: IIdentity): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let token = jwt.sign(identity, config.secret, {
                expiresIn: 1440
            });

            resolve(token);
        });
    }

}
