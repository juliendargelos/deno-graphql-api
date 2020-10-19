import { autoload } from '~/core/autoload.ts'

export const resolvers = await autoload(async (resolvers, { path }) => {
  const { Query = {}, Mutation = {} } = await import(path)
  Object.assign(resolvers.Query, Query)
  Object.assign(resolvers.Mutation, Mutation)
}, { Query: {}, Mutation: {} }, import.meta)
