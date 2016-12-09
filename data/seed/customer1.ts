import connectToMongoDb from '../mongo-utils';
import { getUserModel } from '../models';
import * as winston from 'winston';

export default function seedCustomer1() {
    connectToMongoDb('mongodb://localhost/customer1').then((conn) => {
        let UserModel = getUserModel(conn);

        winston.debug('Seeding users for customer1');

        UserModel.find({}).then((users) => {
            if (users.length !== 0) {
                return;
            }

            UserModel.create({
                firstName: 'Orlando',
                lastName: 'Quero',
                middleName: '',
                email: 'orlando@novapointofsale.com',
                username: 'orlando',
                password: 'pass123',
                roles: ['role1', 'role2' ]
            });

            UserModel.create({
                firstName: 'Mario',
                lastName: 'Quero',
                middleName: '',
                email: 'mario@novapointofsale.com',
                username: 'marito',
                password: 'password',
                roles: ['role1' ]
            });
        });
    });
};
