import { deepEqual } from 'zoroaster/assert'
import fork from '../../src'
import Log from '../context/Log'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Log,
  async 'writes inputs without answers'() {
    const res = await fork({
      forkConfig: {
        module: 'test/fixture/input.js',
        inputs: [
          [/Answer 1/, 'hello'],
          [/Answer 2/, 'world'],
        ],
        includeAnswers: false,
      },
    })
    deepEqual(res, {
      stdout: 'Answer 1: Answer 2: ',
      stderr: 'hello\nworld\n',
      code: 0,
    })
  },
  async 'writes inputs with answers'() {
    const res = await fork({
      forkConfig: {
        module: 'test/fixture/input.js',
        inputs: [
          [/Answer 1/, 'hello'],
          [/Answer 2/, 'world'],
        ],
      },
    })
    deepEqual(res, {
      stdout: 'Answer 1: hello\nAnswer 2: world\n',
      stderr: 'hello\nworld\n',
      code: 0,
    })
  },
}

export default T