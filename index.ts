import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as winston from 'winston';
import run from './playground';

// run the tests in playground
run();

// middlewares
import { tokenValidator, accountContext, logger } from './middlewares';

// Routes
import { auth } from './routes';

// Setting logging level
(winston as any).level = process.env.LOG_LEVEL || 'debug';
winston.add(winston.transports.File, { filename: 'app.log' });
winston.cli();

// Seeding database
import seed from './data/seed';
seed();

// Playground
// import runPlayground from './playground';
// runPlayground();

// import makeDefaultConnection from './data/nova-connector';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { Schema } from './data/nova-accounts-schema';
import Resolvers from './data/nova-accounts-resolvers';
// import Mocks from './data/mocks';

const GRAPHQL_PORT = 8081;

const graphQLServer = express();

graphQLServer.use('*', cors());

// enable parsing
graphQLServer.use(bodyParser.urlencoded({ extended: false }));
graphQLServer.use(bodyParser.json());

// middlewares
// enable logger
graphQLServer.use(logger);
// validate tokens
graphQLServer.use(tokenValidator);
// this middleware will create a mongodb connection to a customer
graphQLServer.use(accountContext);


const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
  allowUndefinedInResolve: false,
//   printErrors: true,
});

// addMockFunctionsToSchema({
//   schema: executableSchema,
//   mocks: Mocks,
//   preserveResolvers: true,
// });


// Routes
graphQLServer.use('/auth', auth);

// `context` must be an object and can't be undefined when using connectors
graphQLServer.use('/graphql', bodyParser.json(), apolloExpress((req) => ({
  schema: executableSchema,
  context: req,
})));

graphQLServer.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

// first of all make sure we can connecto to mongo db

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));





