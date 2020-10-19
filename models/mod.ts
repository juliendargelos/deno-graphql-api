import { autoload } from '~/core/autoload.ts'

export const models = await autoload(async (models: any[], { path, name }) => {
  models.push((await import(path))[name.slice(0, -3)])
}, [], import.meta)
