const typeDefinitions = `

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

type Query {
  account(name: String): Account
}

type Mutation {
  createAccount(name: String!, fullname: String!, email: String!) : Account
}

schema {
  query: Query
  mutation: Mutation
}
`;

const Schema = [typeDefinitions];

export { Schema };
