export interface GraphqlSchema {
    queries: string;
    types: string;
    mutations: string;
}


export interface GraphqlDefinition {
    schema: GraphqlSchema;
    resolvers: any;
}