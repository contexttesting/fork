import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import fork from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof fork, 'function')
  },
  async 'calls package without error'() {
    await fork()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await fork({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T