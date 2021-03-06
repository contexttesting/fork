/**
 * @fileoverview
 * @externs
 */

/* typal types/run.xml */
/** @const */
var _contextTesting = {}
/**
 * Options for the run method.
 * @typedef {{ forkConfig: (string|!_contextTesting.ForkConfig), input: string, props: ((*)|undefined), contexts: ((!Array<_contextTesting.Context>)|undefined) }}
 */
_contextTesting.RunFork
/**
 * The output of the fork method.
 * @typedef {{ stdout: string, stderr: string, code: number }}
 */
_contextTesting.ForkResult

/* typal types/context.xml */
/**
 * A context made with a constructor.
 * @typedef {{ _init: ((function(): !Promise|void)|undefined), _destroy: ((function(): !Promise|void)|undefined) }}
 */
_contextTesting.Context

/* typal types/index.xml */
/**
 * Parameters for forking.
 * @record
 */
_contextTesting.ForkConfig
/**
 * The path to the module to fork.
 * @type {string}
 */
_contextTesting.ForkConfig.prototype.module
/**
 * Options for the forked processed, such as `ENV` and `cwd`.
 * @type {(!child_process.ForkOptions)|undefined}
 */
_contextTesting.ForkConfig.prototype.options
/**
 * Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @type {(!Array<!Array<(!RegExp|string)>>)|undefined}
 */
_contextTesting.ForkConfig.prototype.inputs
/**
 * Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @type {(!Array<!Array<(!RegExp|string)>>)|undefined}
 */
_contextTesting.ForkConfig.prototype.stderrInputs
/**
 * Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. Default `false`.
 * @type {(boolean|{stderr: !(stream.Writable|NodeJS.WriteStream), stdout: !(stream.Writable|NodeJS.WriteStream)})|undefined}
 */
_contextTesting.ForkConfig.prototype.log
/**
 * Whether to add the answers to the `stderr` and `stdout` output. Default `true`.
 * @type {boolean|undefined}
 */
_contextTesting.ForkConfig.prototype.includeAnswers
/**
 * Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result. Default `true`.
 * @type {boolean|undefined}
 */
_contextTesting.ForkConfig.prototype.stripAnsi
/**
 * On Windows, updates all `\n` to `\r\n`, as `console.log` only prints `\n`. Default `false`.
 * @type {boolean|undefined}
 */
_contextTesting.ForkConfig.prototype.normaliseOutputs
/**
 * The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.
 * @type {((_contextTesting.Preprocessor|_contextTesting.ForkPreprocessor))|undefined}
 */
_contextTesting.ForkConfig.prototype.preprocess
/**
 * The function to extend arguments to pass the fork based on the parsed mask input and contexts. The `this` context is set to the passed properties.
 * @type {(function(this: Object,!Array<string>,..._contextTesting.Context): !(Array<string>|Promise<!Array<string>>))|undefined}
 */
_contextTesting.ForkConfig.prototype.getArgs = function(forkArgs, ...contexts) {}
/**
 * The function to get options for the fork, such as `ENV` and `cwd`, based on contexts. The `this` context is set to the passed properties.
 * @type {(function(this: Object,..._contextTesting.Context): !child_process.ForkOptions)|undefined}
 */
_contextTesting.ForkConfig.prototype.getOptions = function(...contexts) {}
/**
 * The function which processes fork's outputs before returning them for asserts.
 * @typedef {function(string): string}
 */
_contextTesting.Preprocessor
/**
 * An object with `stdout` and `stderr` preprocessors.
 * @record
 */
_contextTesting.ForkPreprocessor
/**
 * How to process `stdout` before asserts.
 * @type {(function(string): string)|undefined}
 */
_contextTesting.ForkPreprocessor.prototype.stdout = function(stdout) {}
/**
 * How to process `stderr` before asserts, for example, you can strip `\r` symbols with `clearr` package.
 * @type {(function(string): string)|undefined}
 */
_contextTesting.ForkPreprocessor.prototype.stderr = function(stdout) {}

/* typal types/api.xml */
/**
 * This method will fork a process, and pass the inputs when `stdin` expects an input. Because `includeAnswers` is set to `true` by default, the answers will be included in the resulting `stdout` and `stderr` properties.
    Returns the result of the work, updated to contain answers in the interactive mode.
 * @typedef {function(!_contextTesting.RunFork): !Promise<!_contextTesting.ForkResult>}
 */
_contextTesting.fork
