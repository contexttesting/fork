export {}

/* typal types/context.xml namespace */
/**
 * @typedef {_contextTesting.Context} Context A context made with a constructor.
 * @typedef {Object} _contextTesting.Context A context made with a constructor.
 * @prop {() => (!Promise|void)} [_init] The function to initialise the context.
 * @prop {() => (!Promise|void)} [_destroy] The function to destroy the context.
 */

/* typal types/index.xml namespace */
/**
 * @typedef {import('child_process').ForkOptions} child_process.ForkOptions
 * @typedef {import('stream').Writable} stream.Writable
 * @typedef {_contextTesting.ForkConfig} ForkConfig `＠record` Parameters for forking.
 * @typedef {Object} _contextTesting.ForkConfig `＠record` Parameters for forking.
 * @prop {string} module The path to the module to fork.
 * @prop {!child_process.ForkOptions} [options] Options for the forked processed, such as `ENV` and `cwd`.
 * @prop {Array<[RegExp, string]>} [inputs] Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @prop {Array<[RegExp, string]>} [stderrInputs] Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @prop {boolean|{stderr: !(stream.Writable|NodeJS.WriteStream), stdout: !(stream.Writable|NodeJS.WriteStream)}} [log=false] Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. Default `false`.
 * @prop {boolean} [includeAnswers=true] Whether to add the answers to the `stderr` and `stdout` output. Default `true`.
 * @prop {boolean} [stripAnsi=true] Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result. Default `true`.
 * @prop {(_contextTesting.Preprocessor|_contextTesting.ForkPreprocessor)} [preprocess] The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.
 * @prop {(this: Object, forkArgs: !Array<string>, ...contexts: _contextTesting.Context[]) => !(Array<string>|Promise<!Array<string>>)} [getArgs] The function to extend arguments to pass the fork based on the parsed mask input and contexts. The `this` context is set to the passed properties.
 * @prop {(this: Object, ...contexts: _contextTesting.Context[]) => !child_process.ForkOptions} [getOptions] The function to get options for the fork, such as `ENV` and `cwd`, based on contexts. The `this` context is set to the passed properties.
 * @typedef {_contextTesting.Preprocessor} Preprocessor The function which processes fork's outputs before returning them for asserts.
 * @typedef {function(string): string} _contextTesting.Preprocessor The function which processes fork's outputs before returning them for asserts.
 * @typedef {_contextTesting.ForkPreprocessor} ForkPreprocessor An object with `stdout` and `stderr` preprocessors.
 * @typedef {Object} _contextTesting.ForkPreprocessor An object with `stdout` and `stderr` preprocessors.
 * @prop {_contextTesting.Preprocessor} [stdout] How to process `stdout` before asserts.
 * @prop {_contextTesting.Preprocessor} [stderr] How to process `stderr` before asserts.
 */

/* typal types/run.xml namespace */
/**
 * @typedef {_contextTesting.RunFork} RunFork Options for the run method.
 * @typedef {Object} _contextTesting.RunFork Options for the run method.
 * @prop {(string|!_contextTesting.ForkConfig)} forkConfig Either the config, or the path to the module to fork.
 * @prop {string} input The input to the test from the mask's result. It will be converted into an array of strings to become arguments to pass to the fork.
 * @prop {*} [props] The properties to pass to the `getArgs` and `getOptions` as their this context. These properties will be got from the mask's result.
 * @prop {!Array<_contextTesting.Context>} [contexts] The contexts for the test to be passed to `getArgs` and `getOptions`.
 * @typedef {_contextTesting.ForkResult} ForkResult
 * @typedef {Object} _contextTesting.ForkResult
 * @prop {string} stdout The output from the `stdout` stream, possibly with answers fed to `stdin`.
 * @prop {string} stderr The output from the `stderr` stream,  possibly with answers fed to `stdin`.
 * @prop {number} code The code with which the process exited.
 */
