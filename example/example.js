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
    },
    input: 'hello world',
    props: {
      prop1: '999',
    },
  })
  console.log(res)
})()