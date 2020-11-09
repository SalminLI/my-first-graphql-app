
const resolvers = {

  Query: {
    allUsers: (_, args, { db }) =>
      db.collection('users').find().toArray(),

    user: (_, args, { db }) =>
      db.collection('users').findOne({ name: args.name })
  },

  Mutation: {
    addUser: async (_, args, { db }) => {
      await db.collection('users').insert(args);
      res = await db.collection('users').findOne({ name: args.name, password: args.password});
      return res;
    },
  }

};

module.exports = resolvers
