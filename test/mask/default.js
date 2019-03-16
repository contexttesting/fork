import makeTestSuite from '@zoroaster/mask'
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
})

export const preprocess = makeTestSuite('test/result/pre', {
  async getResults(input) {
    const res = await fork({
      forkConfig: {
        module: input,
        preprocess: {
          stdout(a) { return 'pre-stdout ' + a },
          stderr(a) { return 'pre-stderr ' + a },
        },
      },
      props: {
        stdout: this.stdout,
        stderr: this.stderr,
      },
    })
    return res
  },
})