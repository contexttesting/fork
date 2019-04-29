# @zoroaster/fork

[![npm version](https://badge.fury.io/js/%40zoroaster%2Ffork.svg)](https://npmjs.org/package/@zoroaster/fork)

`@zoroaster/fork` is used in _Zoroaster_ to test forks.

```sh
yarn add -E @zoroaster/fork
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async fork(forkConfig: string|!ForkConfig, input: string, props?: *, contexts?: !Array<!Context>): ForkResult`](#async-forkforkconfig-stringforkconfiginput-stringprops-contexts-arraycontext-forkresult)
  * [`_contextTesting.RunFork`](#type-_contexttestingrunfork)
  * [`_contextTesting.ForkResult`](#type-_contexttestingforkresult)
  * [`_contextTesting.ForkConfig`](#type-_contexttestingforkconfig)
  * [`_contextTesting.Preprocessor`](#type-_contexttestingpreprocessor)
  * [`_contextTesting.ForkPreprocessor`](#type-_contexttestingforkpreprocessor)
  * [`_contextTesting.Context`](#type-_contexttestingcontext)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import fork from '@zoroaster/fork'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `async fork(`<br/>&nbsp;&nbsp;`forkConfig: string|!ForkConfig,`<br/>&nbsp;&nbsp;`input: string,`<br/>&nbsp;&nbsp;`props?: *,`<br/>&nbsp;&nbsp;`contexts?: !Array<!Context>,`<br/>`): ForkResult`

This method will fork a process, and pass the inputs when `stdin` expects an input. Because `includeAnswers` is set to `true` by default, the answers will be included in the resulting `stdout` and `stderr` properties.

__<a name="type-_contexttestingrunfork">`_contextTesting.RunFork`</a>__: Options for the run method.

|      Name       |                                         Type                                         |                                                             Description                                                              |
| --------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| __forkConfig*__ | <em>(string \\| [!_contextTesting.ForkConfig](#type-_contexttestingforkconfig))</em> | Either the config, or the path to the module to fork.                                                                                |
| __input*__      | <em>string</em>                                                                      | The input to the test from the mask's result. It will be converted into an array of strings to become arguments to pass to the fork. |
| props           | <em>*</em>                                                                           | The properties to pass to the `getArgs` and `getOptions` as their this context. These properties will be got from the mask's result. |
| contexts        | <em>!Array&lt;[_contextTesting.Context](#type-_contexttestingcontext)&gt;</em>       | The contexts for the test to be passed to `getArgs` and `getOptions`.                                                                |

__<a name="type-_contexttestingforkresult">`_contextTesting.ForkResult`</a>__

|    Name     |      Type       |                                 Description                                 |
| ----------- | --------------- | --------------------------------------------------------------------------- |
| __stdout*__ | <em>string</em> | The output from the `stdout` stream, possibly with answers fed to `stdin`.  |
| __stderr*__ | <em>string</em> | The output from the `stderr` stream,  possibly with answers fed to `stdin`. |
| __code*__   | <em>number</em> | The code with which the process exited.                                     |

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
```
```js
{ code: 5,
  stdout: '[ \'hello\', \'world\', \'999\' ]\n',
  stderr: 'CONTEXT - hello world\n' }
```

---

[`import('child_process').ForkOptions`](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options) __<a name="type-child_processforkoptions">`child_process.ForkOptions`</a>__

__<a name="type-_contexttestingforkconfig">`_contextTesting.ForkConfig`</a>__: Parameters for forking.

|      Name      |                                                                                 Type                                                                                 |                                                                                                   Description                                                                                                    | Default |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| __module*__    | <em>string</em>                                                                                                                                                      | The path to the module to fork.                                                                                                                                                                                  | -       |
| getArgs        | <em>function(!Array&lt;string&gt;, ...[_contextTesting.Context](#type-_contexttestingcontext)): (!Array&lt;string&gt; \\| !Promise&lt;!Array&lt;string&gt;&gt;)</em> | The function to get arguments to pass the fork based on the parsed mask input and contexts.                                                                                                                      | -       |
| getOptions     | <em>function(...[_contextTesting.Context](#type-_contexttestingcontext)): [!child_process.ForkOptions](#type-child_processforkoptions)</em>                          | The function to get options for the fork, such as `ENV` and `cwd`, based on contexts.                                                                                                                            | -       |
| options        | <em>[!child_process.ForkOptions](#type-child_processforkoptions)</em>                                                                                                | Options for the forked processed, such as `ENV` and `cwd`.                                                                                                                                                       | -       |
| inputs         | <em>Array&lt;[RegExp, string]&gt;</em>                                                                                                                               | Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`. | -       |
| stderrInputs   | <em>Array&lt;[RegExp, string]&gt;</em>                                                                                                                               | Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.                                                                           | -       |
| log            | <em>(boolean \\| { stderr: Writable, stdout: Writable })</em>                                                                                                        | Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties.                            | `false` |
| includeAnswers | <em>boolean</em>                                                                                                                                                     | Whether to add the answers to the `stderr` and `stdout` output.                                                                                                                                                  | `true`  |
| stripAnsi      | <em>boolean</em>                                                                                                                                                     | Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result.                                                                                                                     | `true`  |
| preprocess     | <em>([_contextTesting.Preprocessor](#type-_contexttestingpreprocessor) \\| [_contextTesting.ForkPreprocessor](#type-_contexttestingforkpreprocessor))</em>           | The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.                                              | -       |

`function(string): string` __<a name="type-_contexttestingpreprocessor">`_contextTesting.Preprocessor`</a>__: The function which processes fork's outputs before returning them for asserts.

__<a name="type-_contexttestingforkpreprocessor">`_contextTesting.ForkPreprocessor`</a>__: An object with `stdout` and `stderr` preprocessors.

|  Name  |                                    Type                                    |               Description               |
| ------ | -------------------------------------------------------------------------- | --------------------------------------- |
| stdout | <em>[_contextTesting.Preprocessor](#type-_contexttestingpreprocessor)</em> | How to process `stdout` before asserts. |
| stderr | <em>[_contextTesting.Preprocessor](#type-_contexttestingpreprocessor)</em> | How to process `stderr` before asserts. |

__<a name="type-_contexttestingcontext">`_contextTesting.Context`</a>__: A context made with a constructor.

|   Name   |                   Type                   |               Description               |
| -------- | ---------------------------------------- | --------------------------------------- |
| _init    | <em>function(): (!Promise \\| void)</em> | The function to initialise the context. |
| _destroy | <em>function(): (!Promise \\| void)</em> | The function to destroy the context.    |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright


  (c) [Context Testing](https://contexttesting.com) 2019


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>