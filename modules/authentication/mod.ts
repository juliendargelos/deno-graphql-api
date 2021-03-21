import { RouterContext } from 'oak/mod.ts'
import { ObjectType } from 'cotton/src/basemodel.ts'
import { Authentication, AuthenticationModel } from './Authentication.ts'
export * as resolvers from './resolvers.ts'

export const types = Deno.readTextFileSync(
  new URL('types.graphql', import.meta.url)
)

export function context<User extends AuthenticationModel>(
  model: ObjectType<User>
): (ctx: RouterContext) => { authentication: Authentication<User> } {
  return (ctx: RouterContext) => ({
    authentication: new Authentication(model,
      ctx.request.headers.get('Authorization') || undefined
    )
  })
}
