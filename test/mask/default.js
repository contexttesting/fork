import makeTestSuite from '@zoroaster/mask'
import fork from '../../src'

export default makeTestSuite('test/result/default', {
  async getResults() {
    const { stripAnsi } = this
    const res = await fork({
      forkConfig: {
        module: this.input,
        stripAnsi,
        preprocess: (string) => {
          if (stripAnsi === false) return escape(string)
          return string
        },
        normaliseOutputs: this.normalise,
      },
      props: {
        stdout: this.stdout,
        stderr: this.stderr,
      },
    })
    return res
  },
  jsProps: ['normalise', 'stripAnsi'],
})

export const preprocess = makeTestSuite('test/result/pre', {
  async getResults() {
    const res = await fork({
      forkConfig: {
        module: this.input,
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