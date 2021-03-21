import { Schema } from 'cotton/mod.ts'

export async function up(schema: Schema) {
  await schema.createTable('articles', (table) => {
    table.id()
    table.varchar('uuid')
    table.varchar('title')
    table.varchar('content')
    table.timestamps()
  })
}

export async function down(schema: Schema) {
  await schema.dropTable('articles')
}
