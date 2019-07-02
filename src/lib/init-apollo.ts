import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from 'apollo-boost'
import fetch from 'isomorphic-unfetch'

let apolloClient: ApolloClient<NormalizedCacheObject>;

const create = (initialState: any) => {
  const isBrowser = typeof window !== 'undefined'
  const httpLinkOptions = {
    uri: 'http://localhost:3000/graphql',
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    // Use fetch() polyfill on the server
  } as HttpLink.Options

  if (!isBrowser) {
    httpLinkOptions.fetch = fetch
  }

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink(httpLinkOptions),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

const initApollo = (initialState?: any) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}

export default initApollo