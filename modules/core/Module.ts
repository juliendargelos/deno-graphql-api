import { join } from 'std/path/mod.ts'
import { gql } from 'oak_graphql/mod.ts'
import { BaseModel, ObjectType } from './Model.ts'

export interface Module {
  models: ObjectType<BaseModel>[]
  resolvers: { [type: string]: {} }
  types: string
}

export interface ModuleInput extends Partial<Module> {
  [key: string]: unknown
}

export async function load(
  modules: (ModuleInput | Promise<ModuleInput>)[]
): Promise<Module> {
  let merged: Module = { models: [], resolvers: {}, types: '' }

  for (var i = 0; i < modules.length; i++)  {
    const {
      models = [],
      resolvers = {},
      types = ''
    } = await modules[i]

    merged.models.push(...models)

    Object.entries(resolvers).forEach(([type, value]) => {
      if (!(type in merged.resolvers)) {
        merged.resolvers[type] = {}
      }

      Object.assign(merged.resolvers[type], value)
    })

    merged.types = gql`${merged.types}\n${types}`
  }

  return merged
}

export async function autoload(path: string): Promise<Module> {
  let modules: Promise<ModuleInput>[] = []

  if (path[0] !== '/') {
    path = join(Deno.cwd(), path)
  }

  for await (const module of Deno.readDir(path)) {
    modules.push(import(join(path, module.name, 'mod.ts')))
  }

  return load(modules)
}
