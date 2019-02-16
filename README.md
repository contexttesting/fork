# @zoroaster/fork

[![npm version](https://badge.fury.io/js/%40zoroaster%2Ffork.svg)](https://npmjs.org/package/@zoroaster/fork)

`@zoroaster/fork` is used in _Zoroaster_ to test forks.

```sh
yarn add -E @zoroaster/fork
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async fork(forkConfig: string|ForkConfig, input: string, props?: *, contexts?: Context[]): { stdout, stderr, code }`](#async-forkforkconfig-stringforkconfiginput-stringprops-contexts-context--stdout-stderr-code-)
  * [`ForkConfig`](#type-forkconfig)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import fork from '@zoroaster/fork'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `async fork(`<br/>&nbsp;&nbsp;`forkConfig: string|ForkConfig,`<br/>&nbsp;&nbsp;`input: string,`<br/>&nbsp;&nbsp;`props?: *,`<br/>&nbsp;&nbsp;`contexts?: Context[],`<br/>`): { stdout, stderr, code }`

This method will fork a process, and pass the inputs when `stdin` expects an input. Because `includeAnswers` is set to `true` by default, the answers will be included in the resulting `stdout` and `stderr` properties.

`import('child_process').ForkOptions` __<a name="type-forkoptions">`ForkOptions`</a>__

__<a name="type-forkconfig">`ForkConfig`</a>__: Parameters for forking.

|      Name      |                                       Type                                        |                                                                                      Description                                                                                      | Default |
| -------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| __module*__    | _string_                                                                          | The path to the module to fork.                                                                                                                                                       | -       |
| getArgs        | _(args: string[], ...contexts?: Context[]) =&gt; string[]\|Promise.&lt;string[]>_ | The function to get arguments to pass the fork based on the parsed mask input and contexts.                                                                                           | -       |
| getOptions     | _(...contexts?: Context[]) =&gt; ForkOptions_                                     | The function to get options for the fork, such as `ENV` and `cwd`, based on contexts.                                                                                                 | -       |
| options        | _[ForkOptions](#type-forkoptions)_                                                | Options for the forked processed, such as `ENV` and `cwd`.                                                                                                                            | -       |
| inputs         | _[RegExp, string][]_                                                              | Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data.                                  | -       |
| stderrInputs   | _[RegExp, string][]_                                                              | Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`).                                                                                                            | -       |
| log            | _boolean\|{stderr: Writable, stdout: Writable}_                                   | Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. | `false` |
| includeAnswers | _boolean_                                                                         | Whether to add the answers to the `stderr` and `stdout` output.                                                                                                                       | `true`  |

_For example, to test the fork with the next code:_
```js
const [,, ...args] = process.argv
console.log(args)
console.error(process.env.EXAMPLE)
process.exit(5)
```

_The ContextTesting/Fork can be used:_
```js
/* yarn example/ */
import fork from '@zoroaster/fork'

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
```
```js
{ code: 5,
  stdout: '[ \'hello\', \'world\', \'999\' ]\n',
  stderr: 'CONTEXT - hello world\n' }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

(c) [Context Testing](https://contexttesting.com) 2019

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>