import mongoose = require('mongoose');
import * as Promise from 'bluebird'
import { IUserModel } from '.';
import * as bcrypt from 'bcrypt';
import { rbacPlugin } from '../../../../lib/rbac';

let Schema = mongoose.Schema,
    SALT_WORK_FACTOR = 10;

let UserSchema = new Schema({
    firstName: { type: String, required: true },
    middleName: String,
    lastName: String,
    email: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    roles: [String]
});

UserSchema.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = (candidatePassword): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return reject(err);
            resolve(isMatch);
        });
    })
};

UserSchema.plugin(rbacPlugin);

export function getUserModel(m: mongoose.Connection): IUserModel {
    return <IUserModel>m.model('User', UserSchema, 'users');
}

