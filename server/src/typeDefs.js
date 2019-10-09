// The GraphQL schema
const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    hello: String
  }

  type AuthResponse {
    token: String
    name: String
  }

  input AuthInput {
    accessToken: String!
  }

  type Mutation {
    authGoogle(input: AuthInput!): AuthResponse
  }
`;
