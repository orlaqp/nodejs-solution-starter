import { GraphqlDefinition } from './graphql-definition';
import glob = require('glob');
import _ = require('lodash');
import path = require('path');
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

// // Load schema files
// files.forEach((file) => {
//     let moduleSchema = require(path.resolve(file));

//     moduleQueries.push(moduleSchema.schema.queries);
//     moduleTypes.push(moduleSchema.schema.types);
//     moduleMutations.push(moduleSchema.schema.mutations);

//     moduleResolvers.push(moduleSchema.resolvers);
// });

// --- MERGE TYPE DEFINITONS

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

function getGlobbedFiles(globPatterns: string, removeRoot?: string) {
	// For context switching
    let _this = this;

	// URL paths regex
    let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
    let output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            glob(globPatterns, function(err, files) {
                if (removeRoot) {
                    files = files.map(function(file) {
                        return file.replace(removeRoot, '');
                    });
                }

                output = _.union(output, files);
            });
        }
    }

    return output;
};



export const GraphqlSchema = {
    schema: [schema],
    resolvers: mergeModuleResolvers({})
};

