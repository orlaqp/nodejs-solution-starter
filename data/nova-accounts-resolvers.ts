import { getMasterContext } from './models';

const resolvers = {
    Query: {
        account(_, args) {
            getMasterContext().then((masterContext) => {
                return masterContext.Account.findOne(args);
            });
        },
    },

    Mutation: {
        createAccount(_, args) {
            getMasterContext().then((masterContext) => {
                return masterContext.Account.createNewAccount(args.name, args.fullname, args.email);
            });
        },
    },

    Account: {
        personalInfo(account) {
            return {
                fullname: account.personalInfo.fullname,
                email: account.personalInfo.email,
            };
        },

        businessInfo(account) {
            return {
                numberOfLocations: account.businessInfo.numberOfLocations,
                country: account.businessInfo.country,
                phoneNumber: account.businessInfo.phoneNumber,
            };
        },

    },

};

export default resolvers;
