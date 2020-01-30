import makeTestSuite from '@zoroaster/mask'
import getArgs from '../../src/lib/get-args'

const ts = makeTestSuite('test/result/get-args', {
  getResults() {
    const matches = getArgs(this.input)
    return matches
  },
  jsonProps: ['expected'],
})

export default ts