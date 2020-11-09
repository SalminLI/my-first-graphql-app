import React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, } from '@apollo/client'
import Contents from './Users'
import './App.css'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql'
  })
})

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Contents />
    </ApolloProvider>
  )
}

export default App
