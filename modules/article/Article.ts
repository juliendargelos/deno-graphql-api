import { BaseModel, Model, Column, DataType } from '~/modules/core/Model.ts'

@Model('articles') export class Article extends BaseModel {
  @Column({ type: DataType.String }) title!: string
  @Column({ type: DataType.String }) content!: string
}
