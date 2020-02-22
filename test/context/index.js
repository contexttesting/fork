import { resolve, join } from 'path'
import { debuglog } from 'util'

const LOG = debuglog('@zoroaster/fork')

const FIXTURE = 'test/fixture'

/**
 * A testing context for the package.
 */
export default class Context {

  /** Path to the fork. */
  get forkPath() {
    return join(FIXTURE, 'fork.js')
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return resolve(FIXTURE, 'test.txt')
  }
  preprocess(s) {
    if (process.platform != 'win32') return s
    return s.replace(/([^\r])\n/g, `$1${EOL}`)
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
}