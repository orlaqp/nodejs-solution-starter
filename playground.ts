import * as logger from 'winston';
// import { enforcer } from './lib/enforcer';
import connectToMongoDb from './data/mongo-utils';
import { getContext } from './data/models/app';

// enforcer
// function testAuthorizations() {
//     enforcer.authorizationTo('create-invoice2', (err, authorized) => {
//         if (err) {
//             logger.error('Error authorizing create-invoice: ' + err);
//         }
//         if (authorized) {
//             logger.info('is authorized: ' + authorized);
//         } else {
//             logger.error('is authorized: ' + authorized);
//         }
//     });
// }

// rbac
function testRbac() {

    console.log('*** TESTING RBAC ***');

    getContext('mongodb://localhost/customer1').then((ctx) => {
        let user = ctx.User.findOne({ username: 'marito' }).then((user) => {

            console.log('User found: ' + user.firstName);

            // user.addRole('admin', (err, role) => {
            //     if (err) {
            //         console.error(err);
            //     }
            //     else {
            //         console.log('Role created!!!!!!!!: ' + role.name);
            //     }
            // })

            user.hasRole('admin', (err, hasRole) => {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log('YES, the user has the role');
                }

            })
        })
    });

}



export default function run() {
    console.log('STARTING PLAYGROUND');
    // testAuthorizations();
    testRbac();
}