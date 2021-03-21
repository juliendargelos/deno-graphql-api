import ormConfig from '../ormconfig.ts'

await Deno.writeTextFile('ormconfig.json', JSON.stringify(ormConfig))

await import('cotton/cli.ts')
