import { deepEqual } from 'zoroaster/assert'
import throws from 'assert-throws'
import Context from '../context'
import fork from '../../src'
import Log from '../context/Log'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'returns result'({ forkPath }) {
    const res = await fork({
      forkConfig: {
        module: forkPath,
      },
    })
    deepEqual(res, {
      stdout: 'test',
      stderr: 'test',
      code: 0,
    })
  },
  async 'returns result with input'({ forkPath }) {
    const res = await fork({
      forkConfig: {
        module: forkPath,
      },
      input: 'test',
    })
    deepEqual(res, {
      stdout: 'test',
      stderr: 'test',
      code: 0,
    })
  },
}

/** @type {Object.<string, (c: Context, l: Log)>} */
export const processLog = {
  context: [Context, Log],
  async 'logs to stdout and stderr'({ forkPath }, { getStderr, getStdout }) {
    await fork({
      forkConfig: {
        module: forkPath,
        log: true,
      },
    })
    const stdout = getStdout()
    const stderr = getStderr()
    deepEqual(stdout, ['test'])
    deepEqual(stderr, ['test'])
  },
}

export default T