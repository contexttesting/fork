import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import fork from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await fork({
      text: input,
    })
    return res
  },
  context: Context,
})

export default ts