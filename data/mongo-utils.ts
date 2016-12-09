// import mongoose = require('mongoose');
import * as mongoose from 'mongoose';
import * as Promise from 'bluebird'
import * as winston from 'winston';

export default function connectToMongoDb(dbUri: string): Promise<mongoose.Connection> {
    winston.debug(`Conecting to server: ${dbUri}`);

    return new Promise<mongoose.Connection>((resolve, reject) => {
        let conn = mongoose.createConnection(dbUri);

        conn.on('connected', () => {
            winston.debug('Mongoose custom connection open to ' + dbUri);
            resolve(conn);
        });

        conn.on('error', (err) => {
            winston.error('Mongoose custom connection error: ' + err);
            reject(err);
        });

        conn.on('disconnected', function () {
            winston.debug('Mongoose custom connection disconnected');
        });

        process.on('SIGINT', function() {
            conn.close(() => {
                winston.debug('Mongoose custom connection disconnected through app termination');
                process.exit(0);
            });
        });
    })
}