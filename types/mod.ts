import { gql } from 'oak_graphql/mod.ts'
import { autoload } from '~/core/autoload.ts'

export const types = gql`${(await autoload(async (types, { path }) => {
  const source = await Deno.readTextFile(path)
  types.source += source + '\n'
}, { source: '' }, import.meta, '*.graphql')).source}`
