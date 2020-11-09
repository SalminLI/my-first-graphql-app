const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { MongoClient } = require('mongodb')
const expressPlayground = require('graphql-playground-middleware-express').default
const { readFileSync } = require('fs')
const resolvers = require('./resolvers.ts')

var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')

async function start() {
  const app = express()
  const url = 'mongodb://localhost:27017';
  let db
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
    const dbName = 'test';
    db = client.db(dbName)
  } catch (error) {
    console.log(`
      Mongo DB Host not found!
      exiting...
    `)
    process.exit(1)
  }
  
  const context = {db}
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  })

  server.applyMiddleware({ app })
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

  app.listen({ port: 4000 }, () =>
    console.log(`GraphQL Server running at http://localhost:4000${server.graphqlPath}`)
  )
}

start()