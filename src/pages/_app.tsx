import * as React from 'react'
import App, { Container } from 'next/app'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost'
import withApolloClient from '../lib/with-apollo-client'

interface _AppProps {
  apolloClient: ApolloClient<NormalizedCacheObject>
}

class _App extends App<_AppProps> {
  render () {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApolloClient(_App)