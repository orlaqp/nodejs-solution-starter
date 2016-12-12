// import { getMasterContext, IAccount } from './models';
// import { ExtendedRequest } from '../middlewares';
// import { CreateAccountMutation } from '.'

// const resolvers = {
//     Query: {
//         account(_: ExtendedRequest, args) {
//             getMasterContext().then((masterContext) => {
//                 return masterContext.Account.findOne(args);
//             });
//         },
//     },

//     Mutation: {
//         createAccount(_: ExtendedRequest, args) {
//             let mutation = new CreateAccountMutation(_.identity, _.masterContext.Account);
//             _.mutationBus.run<IAccount>('create-account', mutation, args);
//         },
//     },

//     Account: {
//         personalInfo(account) {
//             return {
//                 fullname: account.personalInfo.fullname,
//                 email: account.personalInfo.email,
//             };
//         },

//         businessInfo(account) {
//             return {
//                 numberOfLocations: account.businessInfo.numberOfLocations,
//                 country: account.businessInfo.country,
//                 phoneNumber: account.businessInfo.phoneNumber,
//             };
//         },

//     },

// };

// export default resolvers;
