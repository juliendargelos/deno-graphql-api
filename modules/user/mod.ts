import { User } from './User.ts'

export * as resolvers from './resolvers.ts'

export const types = Deno.readTextFileSync(
  new URL('types.graphql', import.meta.url)
)

export const models = [
  User
]
