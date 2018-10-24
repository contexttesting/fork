import { makeTestSuite } from 'zoroaster'
import getArgs from '../../src/lib/get-args'

const ts = makeTestSuite('test/result/get-args.md', {
  getResults(input) {
    const matches = getArgs(input)
    return matches
  },
  jsonProps: ['expected'],
})

export default ts