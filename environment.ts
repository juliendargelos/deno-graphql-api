import 'https://deno.land/x/dotenv@v0.5.0/load.ts'

export const PORT = parseInt(Deno.env.get('PORT')!, 10)
export const IMAGE = Deno.env.get('IMAGE')!
export const SECRET = Deno.env.get('SECRET')!
export const PRODUCTION = Deno.env.get('DENO_ENV') === 'production'
export const DEVELOPMENT = !PRODUCTION
export const DATABASE_URL = Deno.env.get('DATABASE_URL')!
export const DATABASE_TYPE = DATABASE_URL.split(':')[0] as 'sqlite'
export const DATABASE = {
  type: DATABASE_TYPE,
  ...(DATABASE_TYPE === 'sqlite'
    ? { database: DATABASE_URL.slice(10) }
    : { url: DATABASE_URL }
  )
}
