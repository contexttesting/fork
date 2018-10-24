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
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
}