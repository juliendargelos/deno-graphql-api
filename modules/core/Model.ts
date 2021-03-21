import { v4 as uuid } from 'std/uuid/mod.ts'

import {
  BaseModel as _BaseModel,
  Model as _Model,
  Primary,
  Column,
  BelongsTo,
  HasMany,
  DataType
} from 'cotton/mod.ts'

export { ObjectType } from 'cotton/src/basemodel.ts'

export {
  Primary,
  Column,
  BelongsTo,
  HasMany,
  DataType
}

export function Model(tableName?: string) {
  return (target: Function) => {
    _Model(tableName)(target)
    Primary()(target.prototype, 'id')
    Column({ type: DataType.String })(target.prototype, 'uuid')
    Column({ type: DataType.Date, name: 'created_at' })(target.prototype, 'createdAt')
    Column({ type: DataType.Date, name: 'updated_at' })(target.prototype, 'updatedAt')
  }
}

export abstract class BaseModel extends _BaseModel {
  public id!: number
  public uuid!: string
  public createdAt!: Date
  public updatedAt!: Date

  public static async find<T extends BaseModel>(uuid: string): Promise<T> {
    const result = await (this as any).query().where('uuid', uuid).first()

    if (!result) {
      throw new Error(`${this.name} does not exist`)
    }

    return result
  }

  public set(attributes: Partial<this>): this {
    return Object.assign(this, attributes)
  }

  public get persisted(): boolean {
    return !!this.uuid
  }

  public async save(): Promise<this> {
    const date = new Date()
    this.updatedAt = date

    if (!this.persisted) {
      this.uuid = uuid.generate()
      this.createdAt = date
    }

    return super.save()
  }
}
