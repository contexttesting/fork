# @zoroaster/fork

[![npm version](https://badge.fury.io/js/%40zoroaster%2Ffork.svg)](https://www.npmjs.com/package/@zoroaster/fork)

`@zoroaster/fork` is used in _Zoroaster_ to test forks. It is part of the [`@zoroaster/mask`](https://github.com/contexttesting/mask) package which uses it to compare forks' output against the results written in non-js files. Nevertheless, the package can be used on its own to spawn and test forks &mdash; the library allows to fork a process and then asserts on the `stderr`, `stdout` and `code` properties, if they are passed, and returns the actual values if the assertions passed.

```sh
yarn add @zoroaster/fork
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async fork(options): !ForkResult`](#async-forkoptions-runfork-forkresult)
  * [`RunFork`](#type-runfork)
  * [`ForkResult`](#type-forkresult)
- [Types](#types)
  * [`ForkConfig`](#type-forkconfig)
  * [`Preprocessor`](#type-preprocessor)
  * [`ForkPreprocessor`](#type-forkpreprocessor)
  * [`Context`](#type-context)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import fork from '@zoroaster/fork'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## <code>async <ins>fork</ins>(</code><sub><br/>&nbsp;&nbsp;`options: !RunFork,`<br/></sub><code>): <i>!ForkResult</i></code>
This method will fork a process, and pass the inputs when `stdin` expects an input. Because `includeAnswers` is set to `true` by default, the answers will be included in the resulting `stdout` and `stderr` properties.
Returns the result of the work, updated to contain answers in the interactive mode.

 - <kbd><strong>options*</strong></kbd> <em><code><a href="#type-runfork" title="Options for the run method.">!RunFork</a></code></em>: Options for the run method.

__<a name="type-runfork">`RunFork`</a>__: Options for the run method.


|      Name       |                                                 Type                                                  |                                                             Description                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| __forkConfig*__ | <em>(string \| <a href="#type-forkconfig" title="Parameters for forking.">!ForkConfig</a>)</em>       | Either the config, or the path to the module to fork.                                                                                |
| __input*__      | <em>string</em>                                                                                       | The input to the test from the mask's result. It will be converted into an array of strings to become arguments to pass to the fork. |
| props           | <em>*</em>                                                                                            | The properties to pass to the `getArgs` and `getOptions` as their this context. These properties will be got from the mask's result. |
| contexts        | <em>!Array&lt;<a href="#type-context" title="A context made with a constructor.">Context</a>&gt;</em> | The contexts for the test to be passed to `getArgs` and `getOptions`.                                                                |


__<a name="type-forkresult">`ForkResult`</a>__: The output of the fork method.


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

_@ContextTesting/Fork package can be used:_
```js
/* yarn example/ */
import fork from '@zoroaster/fork'

(async () => {
  /** @suppress {checkTypes} */
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
            'EXAMPLE': `${CONTEXT} - ${this.input}`,
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
      'stdout': `pre-[ 'hello', 'world', '999' ]`,
      'stderr': 'pre-CONTEXT - hello world',
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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## Types

The following types are used in this software.

__<a name="type-forkconfig">`ForkConfig`</a>__: Parameters for forking.


|      Name      |                                                                                                                                                                                                                                                            Type                                                                                                                                                                                                                                                            |                                                                                                   Description                                                                                                    | Default |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| __module*__    | <em>string</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | The path to the module to fork.                                                                                                                                                                                  | -       |
| options        | <em><a href="https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options" title="Options to fork a child process with. Allows to set cwd, environment variables, etc."><img src=".documentary/type-icons/node-even.png" alt="Node.JS Docs">!child_process.ForkOptions</a></em>                                                                                                                                                                                                      | Options for the forked processed, such as `ENV` and `cwd`.                                                                                                                                                       | -       |
| inputs         | <em>!Array&lt;!Array&lt;(!RegExp \| string)&gt;&gt;</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`. | -       |
| stderrInputs   | <em>!Array&lt;!Array&lt;(!RegExp \| string)&gt;&gt;</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.                                                                           | -       |
| log            | <em>(boolean \| { stderr: !(<a href="https://nodejs.org/api/stream.html#stream_class_stream_writable" title="A stream that can be written data to."><img src=".documentary/type-icons/node-odd.png" alt="Node.JS Docs">stream.Writable</a> \| NodeJS.WriteStream), stdout: !(<a href="https://nodejs.org/api/stream.html#stream_class_stream_writable" title="A stream that can be written data to."><img src=".documentary/type-icons/node-odd.png" alt="Node.JS Docs">stream.Writable</a> \| NodeJS.WriteStream) })</em> | Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties.                            | `false` |
| includeAnswers | <em>boolean</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Whether to add the answers to the `stderr` and `stdout` output.                                                                                                                                                  | `true`  |
| stripAnsi      | <em>boolean</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result.                                                                                                                     | `true`  |
| preprocess     | <em>(<a href="#type-preprocessor" title="The function which processes fork's outputs before returning them for asserts.">Preprocessor</a> \| <a href="#type-forkpreprocessor" title="An object with `stdout` and `stderr` preprocessors.">ForkPreprocessor</a>)</em>                                                                                                                                                                                                                                                       | The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.                                              | -       |
| getArgs        | <em>(this: Object, forkArgs: !Array&lt;string&gt;, ...contexts: <a href="#type-context" title="A context made with a constructor.">Context</a>[]) => !(Array&lt;string&gt; \| Promise&lt;!Array&lt;string&gt;&gt;)</em>                                                                                                                                                                                                                                                                                                    | The function to extend arguments to pass the fork based on the parsed mask input and contexts. The `this` context is set to the passed properties.                                                               | -       |
| getOptions     | <em>(this: Object, ...contexts: <a href="#type-context" title="A context made with a constructor.">Context</a>[]) => <a href="https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options" title="Options to fork a child process with. Allows to set cwd, environment variables, etc."><img src=".documentary/type-icons/node-even.png" alt="Node.JS Docs">!child_process.ForkOptions</a></em>                                                                                     | The function to get options for the fork, such as `ENV` and `cwd`, based on contexts. The `this` context is set to the passed properties.                                                                        | -       |


`function(string): string` __<a name="type-preprocessor">`Preprocessor`</a>__: The function which processes fork's outputs before returning them for asserts.


__<a name="type-forkpreprocessor">`ForkPreprocessor`</a>__: An object with `stdout` and `stderr` preprocessors.


|  Name  |              Type              |                                              Description                                               |
| ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| stdout | <em>(stdout: string) => ?</em> | How to process `stdout` before asserts.                                                                |
| stderr | <em>(stdout: string) => ?</em> | How to process `stderr` before asserts, for example, you can strip `\r` symbols with `clearr` package. |

__<a name="type-context">`Context`</a>__: A context made with a constructor.


|   Name   |               Type                |               Description               |
| -------- | --------------------------------- | --------------------------------------- |
| _init    | <em>() => (!Promise \| void)</em> | The function to initialise the context. |
| _destroy | <em>() => (!Promise \| void)</em> | The function to destroy the context.    |

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## Copyright


  (c) [Context Testing](https://contexttesting.com) 2020


<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>