import gql from 'graphql-tag';
import { ApolloCache } from 'apollo-cache';
import { Resolvers } from 'apollo-client'
import { User } from './lib/interfaces'

export const typeDefs = gql`
  extend type Query {
      me: User
  }
`;

type ResolverFn = (
    parent: any,
    args: any,
    { cache }: { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
    [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
    // We will update this with our app's resolvers later
}

export const resolvers = {};