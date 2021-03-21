import logger from 'oak_logger/mod.ts'
import { connect, BaseModel } from 'cotton/mod.ts'
import { Application, Router, RouterContext } from 'oak/mod.ts'
import { applyGraphQL } from 'oak_graphql/mod.ts'
import { autoload, load } from '~/modules/core/mod.ts'
import { context as authenticationContext } from '~/modules/authentication/mod.ts'
import { User } from '~/modules/user/User.ts'
import { PORT, DEVELOPMENT } from '~/environment.ts'
import ormConfig from '~/ormconfig.ts'

const { models, resolvers, types } = await autoload('modules')
const application = new Application()
const database = await connect({ models, ...ormConfig })
const authentication = authenticationContext(User)
const graphql = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
  usePlayground: DEVELOPMENT,
  path: '',
  context: async (ctx: RouterContext) => ({
    ...authentication(ctx)
  })
})

application.use(
  logger.logger,
  logger.responseTime,
  graphql.routes(),
  graphql.allowedMethods()
)

console.log(`Server running on http://localhost:${PORT}`)

await application.listen({ port: PORT })
