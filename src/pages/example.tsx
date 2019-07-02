import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const query = gql`
  query Ping($text: String!) {
    ping(text: $text)
  }
`

const Example = (props: { text?: string }) => {
  const { text } = props
  console.log('text', text)
  return (
    <Query query={query} variables={{ text: text || 'nothing' }}>
      {({ loading, error, data }: any) => loading ? '...loading' : (
        <div>I am an example page! {text ? `with ${text}` : ''} {data ? `and ${data.ping}` : ''}</div>
      )}
    </Query>
  )
}

Example.getInitialProps = ({ query: { text } }: any) => {
  return { text }
}

export default Example