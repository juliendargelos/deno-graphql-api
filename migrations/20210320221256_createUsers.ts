import { Schema } from 'cotton/mod.ts'

export async function up(schema: Schema) {
  await schema.createTable('users', (table) => {
    table.id()
    table.varchar('uuid')
    table.varchar('name')
    table.varchar('email')
    table.varchar('encryptedPassword')
    table.timestamps()
  })
}

export async function down(schema: Schema) {
  await schema.dropTable('users')
}
