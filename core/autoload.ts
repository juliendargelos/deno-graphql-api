import { expandGlob, WalkEntry } from 'std/fs/mod.ts'
import * as path from 'std/path/mod.ts'

export async function autoload<T extends Object | Array<any>>(
  reducer: (
    ((accumulator: T, entry: WalkEntry) => void) |
    ((accumulator: T, entry: WalkEntry) => Promise<void>)
  ),
  accumulator: T,
  meta: { url: string },
  pattern: string = '*.ts'
): Promise<T> {
  const promises = []
  const source = path.fromFileUrl(meta.url)
  const entries = expandGlob(path.isAbsolute(pattern)
    ? pattern
    : path.join(path.dirname(source), pattern)
  )

  for await (const entry of entries) {
    entry.path === source || promises.push(reducer(accumulator, entry))
  }

  await Promise.all(promises)

  return accumulator
}
