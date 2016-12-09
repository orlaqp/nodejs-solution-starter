import { getContext } from '../models';
import { initRoles } from '../../lib/rbac';
import * as winston from 'winston';

export default function seedRoles() {
    getContext('mongodb://localhost/customer1').then((ctx) => {

      winston.debug('Seeding roles for customer1');

        initRoles(ctx, {
          admin: [
            ['create', 'Post'],
            ['read', 'Post'],
            ['update', 'Post'],
            ['delete', 'Post']
          ],
          readonly: [
            // we can also specify permissions as an object
            { action: 'read', subject: 'Post' }
          ]
        }, function (err, admin, readonly) {
          console.log(admin);
          /*
            { __v: 1,
              name: 'admin',
              _id: 513c14dbc90000d10100004e,
              permissions: [ 513c14dbc90000d101000044,
                513c14dbc90000d101000045,
                513c14dbc90000d101000046,
                513c14dbc90000d101000047 ] }
          */
          console.log(readonly);
          /*
            { __v: 1,
              name: 'readonly',
              _id: 513c14dbc90000d10100004f,
              permissions: [ 513c14dbc90000d101000045 ] }
          */
        });
    });
};