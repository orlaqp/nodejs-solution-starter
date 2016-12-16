import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as winston from 'winston';
import run from './playground';

// run the tests in playground
run();

// ACTIVITIES
import { addActivities } from './activities';
addActivities();

// middlewares
import { tokenValidator, accountContext, logger, masterContext, mutationBus, queryBus } from './middlewares';

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

const GRAPHQL_PORT = 8081;

const graphQLServer = express();

graphQLServer.use('*', cors());

// enable parsing
graphQLServer.use(bodyParser.urlencoded({ extended: false }));
graphQLServer.use(bodyParser.json());

// middlewares

// enable logger
graphQLServer.use(logger);
// enable master context
graphQLServer.use(masterContext);
// validate tokens
graphQLServer.use(tokenValidator);
// this middleware will create a mongodb connection to a customer
graphQLServer.use(accountContext);
// enable mutation bus
graphQLServer.use(mutationBus);
// enable query bus
graphQLServer.use(queryBus);


// ACTIVITIES




//  GRAPHQL

// import makeDefaultConnection from './data/nova-connector';
import { graphqlExpress } from 'graphql-server-express';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { GraphqlSchema } from './data/graphql/graphql-schema';
// import Mocks from './data/mocks';

const executableSchema = makeExecutableSchema({
  typeDefs: GraphqlSchema.schema,
  resolvers: GraphqlSchema.resolvers,
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
// graphQLServer.use('/graphql', apolloExpress((req) => ({
//   schema: executableSchema,
//   context: req,
// })));

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress((req) => ({
  context: req,
  schema: executableSchema
})));

graphQLServer.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

// first of all make sure we can connecto to mongo db

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));
