import { DATABASE_URL } from './environment.ts'

const type = DATABASE_URL.split(':')[0] as 'sqlite'

export default {
  type,
  ...(type === 'sqlite'
    ? { database: DATABASE_URL.slice(10) }
    : { url: DATABASE_URL }
  )
}
