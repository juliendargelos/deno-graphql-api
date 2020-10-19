import logger from 'oak_logger/mod.ts'
import { connect } from 'cotton/mod.ts'
import { Application, Router } from 'oak/mod.ts'
import { applyGraphQL } from 'oak_graphql/mod.ts'
import { types } from '~/types/mod.ts'
import { resolvers } from '~/resolvers/mod.ts'
import { models } from '~/models/mod.ts'
import { PORT, DEVELOPMENT } from '~/environment.ts'
import database from '~/orm.config.ts'

const application = new Application()
const database = await connect({ models, ...database })
const graphql = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
  usePlayground: DEVELOPMENT,
  path: ''
})

application.use(
  logger.logger,
  logger.responseTime,
  graphql.routes(),
  graphql.allowedMethods()
)

console.log(`Server running on http://localhost:${PORT}`)

await application.listen({ port: PORT })
