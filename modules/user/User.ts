import * as bcrypt from 'bcrypt/mod.ts'
import { BaseModel, Model, Column, DataType } from '~/modules/core/Model.ts'

export const MINIMUM_PASSWORD_LENGTH = 8

@Model('users') export class User extends BaseModel {
  @Column({ type: DataType.String }) name!: string
  @Column({ type: DataType.String }) email!: string
  @Column({ type: DataType.String }) encryptedPassword!: string

  public password: string = ''

  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.encryptedPassword)
  }

  public async save(): Promise<this> {
    if (this.password) {
      if (this.password.length < MINIMUM_PASSWORD_LENGTH) {
        throw new Error(`Password must have at least ${MINIMUM_PASSWORD_LENGTH} characters`)
      }

      this.encryptedPassword = await bcrypt.hash(this.password)
      this.password = ''
    }

    if (!this.name) {
      throw new Error('Name cannot be blank')
    }

    if (!this.email) {
      throw new Error('Email cannot be blank')
    }

    if (!this.encryptedPassword) {
      throw new Error('Password cannot be blank')
    }

    return super.save()
  }
}
