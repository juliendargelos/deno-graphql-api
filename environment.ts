import 'https://deno.land/x/dotenv@v0.5.0/load.ts'

export const PORT = parseInt(Deno.env.get('PORT')!, 10)
export const IMAGE = Deno.env.get('IMAGE')!
export const SECRET_KEY = Deno.env.get('SECRET_KEY')!
export const PRODUCTION = Deno.env.get('DENO_ENV') === 'production'
export const DEVELOPMENT = !PRODUCTION
export const DATABASE_URL = Deno.env.get('DATABASE_URL')!
