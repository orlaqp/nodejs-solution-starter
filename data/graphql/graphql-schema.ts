// from: https://gist.github.com/icebob/553c1f9f1a9478d828bcb7a08d06790a

import { GraphqlDefinition } from './graphql-definition';
import _ = require('lodash');
import * as logger from 'winston';

// import definitions
import { accountsGql } from './master/accounts.gql';

// let files = getGlobbedFiles(path.join(__dirname, '**', '*.gql.ts'));
let definitions: GraphqlDefinition[] = [];
definitions.push(accountsGql);

let moduleQueries = [];
let moduleTypes = [];
let moduleMutations = [];
let moduleResolvers = [];

definitions.forEach((definition) => {
    logger.debug(`loading gql definition for: ${definition.name}`);

    moduleQueries.push(definition.schema.queries);
    moduleTypes.push(definition.schema.types);
    moduleMutations.push(definition.schema.mutations);

    moduleResolvers.push(definition.resolvers);
})

const schema = `
type Query {
    ${moduleQueries.join('\n')}
}

${moduleTypes.join('\n')}

type Mutation {
    ${moduleMutations.join('\n')}
}
schema {
  query: Query
  mutation: Mutation
}
`;

logger.debug('Full gql definition: ' + schema);

// --- MERGE RESOLVERS

function mergeModuleResolvers(baseResolvers) {
    moduleResolvers.forEach((module) => {
        baseResolvers = _.merge(baseResolvers, module);
    });

    return baseResolvers;
}

export const GraphqlSchema = {
    schema: [schema],
    resolvers: mergeModuleResolvers({})
};

