import { DatabaseDialect } from 'cotton/mod.ts'
import { DATABASE_URL } from '~/environment.ts'

const type: DatabaseDialect = DATABASE_URL.split(':')[0]

export default {
  type,
  ...(type === 'sqlite'
    ? { database: DATABASE_URL.slice(10) }
    : { url: DATABASE_URL }
  )
}
