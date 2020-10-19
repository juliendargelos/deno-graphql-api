import { validateJwt } from 'djwt/validate.ts'
import { makeJwt } from 'djwt/make.ts'
import { BaseModel } from '~/core/BaseModel.ts'

export class Authentication<User extends BaseModel> {
  public readonly user: typeof User
  public user?: User
  public token?: string

  constructor(model: typeof User, token?: string) {
    this.model = model
    this.token = token
  }

  public async validate(): Promise<boolean> {
    const validation = await validateJwt({
      jwt: this.token,
      key: process.env.SECRET_KEY,
      algorithm: header.alg
    })

    if (validation.isValid) {
      this.user = User
        .query()
        .where('id', validation.payload.id)
        .first()
        .execute()
    }

    return !!this.user
  }

  public async make({
    email,
    password
  }: AuthenticationInput): Promise<boolean> {
    const user = await User
      .query()
      .where('email', email)
      .select('id')
      .first()
      .execute()

    if (user && user.matchesPassword(password)) {
      this.token = await makeJwt({
        header,
        key: process.env.SECRET_KEY,
        payload: { id: user.id }
      })
    }

    return !!this.token
  }
}
