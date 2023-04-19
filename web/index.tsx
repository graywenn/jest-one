import './index.css';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import Layout from './pages/layout';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <Layout />
  </ApolloProvider>
);
