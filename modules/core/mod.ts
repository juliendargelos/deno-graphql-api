import { gql } from 'oak_graphql/mod.ts'

export * from './Module.ts'

export * as resolvers from './resolvers.ts'

export const types = Deno.readTextFileSync(
  new URL('types.graphql', import.meta.url)
)
