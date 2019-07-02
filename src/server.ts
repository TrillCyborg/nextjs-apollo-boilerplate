import 'reflect-metadata'
import * as next from 'next'
import * as express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

const schema = gql`
  type Query {
    ping(text: String!): String!
  }
`

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: 'src' });
const handle = app.getRequestHandler();
const graphQLServer = new ApolloServer({
  typeDefs: schema,
  resolvers: {
    Query: { ping: (_: any, args: any) => `${args.text} from GraphQL` },
    // Mutation: { /* ... TODO: Add mutation resolvers here ... */ }
  },
  playground: {
    endpoint: "/graphql"
  }
});

app.prepare().then(() => {
  const server = express()

  graphQLServer.applyMiddleware({ app: server });

  server.get('/example', (req, res) => {
    return app.render(req, res, '/example', req.query)
  })

  server.get('/example/:text', (req, res) => {
    return app.render(req, res, '/example', { text: req.params.text })
  })

  server.get('/', (req, res) => {
    return handle(req, res);
  })

  server.use('*', (req, res) => {
    if (!req.path.match(/graphql/)) {
      return app.render404(req, res);
    }
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  })
});