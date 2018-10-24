import { deepEqual } from 'zoroaster/assert'
import Context from '../context'
import { getForkArguments } from '../../src/lib'

const Options = {
  stdio: 'pipe',
  execArgv: [],
}

/** @type {Object.<string, (m: 'test.js', o: Options, c: Context)>} */
const T = {
  context: ['test.js', Options, Context],
  async 'returns all options without config'(mod, options) {
    const res = await getForkArguments(mod)
    deepEqual(res, { mod, args: [], options })
  },
  async 'returns arguments'(mod, options) {
    const res = await getForkArguments({
      module: mod,
    }, ['test1', 'test2'])
    deepEqual(res, {
      mod,
      args: ['test1', 'test2'],
      options,
    })
  },
  async 'gets arguments'(mod, options) {
    const res = await getForkArguments({
      module: mod,
      getArgs(args, { test }) {
        return [...args, test]
      },
    }, ['test1', 'test2'], [{ test: 'test3' }])
    deepEqual(res, {
      mod,
      args: ['test1', 'test2', 'test3'],
      options,
    })
  },
  async 'returns options'(mod, options) {
    const opts = { ...options, silent: true }
    const res = await getForkArguments({
      module: mod,
      options: opts,
    })
    deepEqual(res, { mod, args: [], options: opts })
  },
  async 'gets options'(mod, options) {
    const res = await getForkArguments({
      module: mod,
      getOptions({ silent }) {
        return { ...options, silent }
      },
    }, [], [{ silent: true }])
    deepEqual(res, { mod, args: [], options: { ...options, silent: true } })
  },
}

export default T