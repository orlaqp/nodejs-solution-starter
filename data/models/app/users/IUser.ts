import { IRoleDocument } from '../../../../lib/rbac/models/roles';
import mongoose = require('mongoose');
import * as Promise from 'bluebird';

export interface IUser {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;

    hasRole(role: string, done: (err: any, hasRole: boolean) => void): void;
    addRole(role: string, done: (err: any, role: IRoleDocument) => void): void;
    removeRole(role: string, done: (err: any) => void): void;
    can(action: string, subject: string, done: (err: any, hasPermission: boolean) => void): void;
    canAll(actionsAndSubjects: any[], done: (err: any, hasAll: boolean) => void): void;
    canAny(actionsAndSubjects: any[], done: (err: any, hasAll: boolean) => void): void;
}

// declare interface to mix account and mongo docuemnt properties/methods
export interface IUserDocument extends IUser, mongoose.Document {
    comparePassword(candidatePassword: String): Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUserDocument> { }
