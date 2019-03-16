import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import fork from '../../src'

export default makeTestSuite('test/result/default', {
  async getResults(input) {
    const stripAnsi = this.stripAnsi
    const res = await fork({
      forkConfig: {
        module: input,
        stripAnsi: stripAnsi,
        preprocess(string) {
          return escape(string)
        },
      },
      props: {
        stdout: this.stdout,
        stderr: this.stderr,
      },
    })
    return res
  },
  jsonProps: ['stripAnsi'],
  context: Context,
})