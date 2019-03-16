/* yarn example/ */
import fork from '../src'

(async () => {
  const res = await fork({
    contexts: ['CONTEXT'],
    forkConfig: {
      module: 'example/fork',
      getArgs(inputs) {
        return [...inputs, this.prop1]
      },
      getOptions(CONTEXT) {
        return {
          env: {
            EXAMPLE: `${CONTEXT} - ${this.input}`,
          },
        }
      },
      preprocess(s) {
        /* e.g., to remove whitespace at the end of each line
          s.split('\n').map(a => a.trimRight()).join('\n')
        */
        return `pre-${s}`
      },
      /* stripAnsi: true */
    },
    input: 'hello world',
    props: {
      prop1: '999',
      stdout: `pre-[ 'hello', 'world', '999' ]`,
      stderr: 'pre-CONTEXT - hello world',
    },
  })
  console.log(res)
})()