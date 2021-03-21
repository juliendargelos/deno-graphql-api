import * as djwt from 'djwt/mod.ts'
import { BaseModel, ObjectType } from '~/modules/core/Model.ts'
import { SECRET_KEY } from '~/environment.ts'

export const AUTHENTICATION_ALGORITHM = 'HS512'

export interface AuthenticationModel extends BaseModel {
  email: string
  checkPassword(password: string): Promise<boolean>
}

export interface AuthenticationInput {
  email: string
  password: string
}

export class Authentication<User extends AuthenticationModel = AuthenticationModel> {
  private readonly model: ObjectType<User>
  public user?: User
  public token?: string

  constructor(model: ObjectType<User>, token?: string) {
    this.model = model
    this.token = token
  }

  public async require(): Promise<this> {
    if (!(await this.validate())) {
      throw new Error('Authentication required')
    }

    return this
  }

  public async validate(): Promise<boolean> {
    if (!this.token) {
      return false
    }

    try {
      const payload = await djwt.verify(
        this.token,
        SECRET_KEY,
        AUTHENTICATION_ALGORITHM
      )

      this.user = await this.model
        .query()
        .where('uuid', payload.uuid as string)
        .first() || undefined

      return !!this.user
    } catch (_) {
      return false
    }
  }

  public async make({
    email,
    password
  }: AuthenticationInput): Promise<boolean> {
    const user = await this.model
      .query()
      .where('email', email)
      .first()

    if (user && await user.checkPassword(password)) {
      this.user = user
      this.token = await djwt.create({
        typ: 'JWT',
        alg: AUTHENTICATION_ALGORITHM
      }, {
        uuid: user.uuid
      }, SECRET_KEY)
    }

    return !!this.token
  }
}
