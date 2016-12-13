let moduleQueries = [];
let moduleTypeDefinitions = [];
let moduleMutations = [];
let moduleResolvers = [];


let files = config.getGlobbedFiles(path.join(__dirname, "**", "*schema.js"));

// Load schema files
files.forEach((file) => {
    let moduleSchema = require(path.resolve(file));

    moduleQueries.push(moduleSchema.schema.query);
    moduleTypeDefinitions.push(moduleSchema.schema.typeDefinitions);
    moduleMutations.push(moduleSchema.schema.mutation);

    moduleResolvers.push(moduleSchema.resolvers);
});

// --- MERGE TYPE DEFINITONS

const schema = `
type Query {
    ${moduleQueries.join('\n')}
}
${moduleTypeDefinitions.join('\n')}
type Mutation {
    ${moduleMutations.join('\n')}
}
schema {
  query: Query
  mutation: Mutation
}
`;

// --- MERGE RESOLVERS

function mergeModuleResolvers(baseResolvers) {
    moduleResolvers.forEach((module) => {
        baseResolvers = _.merge(baseResolvers, module);
    });

    return baseResolvers;
}

module.exports = {
    schema: [schema],
    resolvers: mergeModuleResolvers({})
};