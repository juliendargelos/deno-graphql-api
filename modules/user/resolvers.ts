import { GQLError } from 'oak_graphql/mod.ts'
import { User } from './User.ts'

// export const Query = {
//   async user(parent: any, { uuid }: any): Promise<User> {
//     return User.find(uuid)
//   },

//   async users(): Promise<User[]> {
//     return User.query().all()
//   }
// }

export const Mutation = {
  async createUser(parent: any, { input }: any): Promise<User> {
    return new User().set(input).save()
  },

  async updateUser(parent: any, { input }: any, { authentication }: any): Promise<User> {
    await authentication.require()
    return authentication.user.set(input).save()
  },

  async deleteUser(parent: any, parameters: any, {  authentication }: any): Promise<Boolean> {
    await authentication.require()
    await authentication.user.remove()
    return true
  },
}
