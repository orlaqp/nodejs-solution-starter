import mongoose = require('mongoose');

export interface IPersonalInfo {
    fullname: String;
    email: String;
}

export interface IBusinessInfo {
    numberOfLocations: Number;
    country: String;
    phoneNumber: String;
}

export interface IDatabaseInfo {
    url: String;
    name: String;
}

export interface IAudit {
    createdOn: Date;
    updatedOn: Date;
}

export interface IAccount {
    name: String;
    personalInfo: IPersonalInfo;
    businessInfo: IBusinessInfo;
    database: IDatabaseInfo;
    audit: IAudit;
}

// declare interface to mix account and mongo docuemnt properties/methods
export interface IAccountDocument extends IAccount, mongoose.Document {
    getConnectionString(): string;
}

export interface IAccountModel extends mongoose.Model<IAccountDocument> {
    createNewAccount(name: String, fullname: String, email: String);
    findAccountByHostname(hostname: String): Promise<IAccountDocument>;
}
