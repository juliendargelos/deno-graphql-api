import { GQLError } from 'oak_graphql/mod.ts'
import { Authentication } from './Authentication.ts'

export const Query = {
  async authentication(parent: any, parameters: any, { authentication }: any): Promise<Authentication> {
    await authentication.require()
    return authentication
  }
}

export const Mutation = {
  async createAuthentication(parent: any, { input }: any, { authentication }: any): Promise<Authentication> {
    if (await authentication.make(input)) {
      return authentication
    }

    throw new GQLError('Wrong email or password')
  }
}
