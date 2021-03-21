import { PORT, IMAGE, PRODUCTION, DEVELOPMENT } from './environment.ts'

const ALLOW = {
  env: true,
  net: true,
  read: '.',
  write: '.'
}

export default {
  unstable: true,
  importmap: 'importmap.json',
  tsconfig: 'tsconfig.json',
  lock: 'lock.json',
  watch: false,
  scripts: {
    install: 'deno cache cache.ts --lock-write',
    start: {
      cmd: `deno run mod.ts ${PRODUCTION || true ? '--no-check' : ''}`,
      watch: DEVELOPMENT,
      allow: ALLOW
    },
    'cotton': {
      cmd: `deno run bin/cotton.ts`,
      lock: undefined,
      allow: ALLOW
    },
    'docker:build': `docker build -t ${IMAGE}:local .`,
    'docker:start': `docker run --rm --name ${IMAGE} -p ${PORT}:${PORT} --env-file=.env ${IMAGE}:local`,
  }
}
