// import { Mongoose } from 'mongoose';
import * as Promise from 'bluebird'
import mongoose = require('mongoose');
import { connectToMongoDb } from './mongo-utils';
import { Account } from './models';
import * as winston from 'winston';

export default function connectToAccount(accountName: string): Promise<mongoose.Mongoose> {
  return new Promise<mongoose.Mongoose>((resolve, reject) => {
    // search for the customer account
    Account.findOne({ name: accountName }, (err, account) => {
      // in case the account could not be found, reject the promise
      if (err) {
        winston.error('Error retrieving account', { error: err });
        reject(err);
      }

      if (!account) {
        reject('account not found');
        winston.debug('account not found');
      }

      // conform the database connection uri
      let dbUri = `${account.database.url}/${account.database.name}`;

      // create a custom connection to the customer database
      connectToMongoDb(dbUri).then((connection) => {
        // resolve the promise if the connection was succesfully
        resolve(connection);
      }, (err) => {
        // reject the promise if the connection was not succesful
        winston.error('Error connecting to customer account', {error: err });
        reject(err);
      });
    });
  });

}