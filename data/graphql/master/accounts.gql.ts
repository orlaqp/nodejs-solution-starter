import { GraphqlDefinition } from '../graphql-definition';
import { getMasterContext, IAccount } from '../../models';
import { ExtendedRequest } from '../../../middlewares';
import { CreateAccountMutation, GetAccountQuery } from '../..';
import * as logger from 'winston';

export const accountsGql: GraphqlDefinition = {
    name: 'accounts',
    schema: {
        types: `
            type PersonalInfo {
                fullname: String
                email: String
            }

            type BusinessInfo {
                numberOfLocations: Int
                country: String
                phoneNumber: String
            }

            type Account {
                _id: String
                name: String
                personalInfo: PersonalInfo
                businessInfo: BusinessInfo  
            }
        `,
        queries: `
            account(name: String): Account
        `,
        mutations: `
            createAccount(name: String!, fullname: String!, email: String!) : Account
        `
    },

    resolvers: {
        Query: {
            account(root: any, args, context: ExtendedRequest) {
                let query = new GetAccountQuery(context.identity, context.masterContext.Account);
                return context.queryBus.run<IAccount>('get-account', query, args)
                    .then((account) => account, (err) => err);
            },
        },

        Mutation: {
            createAccount(root: any, args, context: ExtendedRequest) {
                let mutation = new CreateAccountMutation(context.identity, context.masterContext.Account);
                context.mutationBus.run<IAccount>('create-account', mutation, args);
            },
        },

        Account: {
            personalInfo(account) {
                return {
                    fullname: account.personalInfo.fullname || '',
                    email: account.personalInfo.email || '',
                };
            },

            businessInfo(account) {
                return {
                    numberOfLocations: account.businessInfo.numberOfLocations || '',
                    country: account.businessInfo.country || '',
                    phoneNumber: account.businessInfo.phoneNumber || '',
                };
            },
        },
    }
}


