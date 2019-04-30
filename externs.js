/* typal types/run.xml */
/** @const */
var _contextTesting = {}
/**
 * Options for the run method.
 * @typedef {{ forkConfig: (string|!_contextTesting.ForkConfig), input: string, props: (*|undefined), contexts: (!Array<_contextTesting.Context>|undefined) }}
 */
_contextTesting.RunFork
/**
 * @typedef {{ stdout: string, stderr: string, code: number }}
 */
_contextTesting.ForkResult

/* typal types/context.xml */
/**
 * A context made with a constructor.
 * @typedef {{ _init: (function(): !Promise|void|undefined), _destroy: (function(): !Promise|void|undefined) }}
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
 * The function to get arguments to pass the fork based on the parsed mask input and contexts.
 * @type {(function(!Array<string>, ..._contextTesting.Context): !Array<string>|!Promise<!Array<string>>|undefined)}
 */
_contextTesting.ForkConfig.prototype.getArgs
/**
 * The function to get options for the fork, such as `ENV` and `cwd`, based on contexts.
 * @type {(function(..._contextTesting.Context): !child_process.ForkOptions|undefined)}
 */
_contextTesting.ForkConfig.prototype.getOptions
/**
 * Options for the forked processed, such as `ENV` and `cwd`.
 * @type {(!child_process.ForkOptions|undefined)}
 */
_contextTesting.ForkConfig.prototype.options
/**
 * Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @type {(!Array<!Array<(!RegExp|string)>>|undefined)}
 */
_contextTesting.ForkConfig.prototype.inputs
/**
 * Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @type {(!Array<!Array<(!RegExp|string)>>|undefined)}
 */
_contextTesting.ForkConfig.prototype.stderrInputs
/**
 * Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties.
 * @type {(boolean|{stderr: !(stream.Writable|NodeJS.WriteStream), stdout: !(stream.Writable|NodeJS.WriteStream)}|undefined)}
 */
_contextTesting.ForkConfig.prototype.log
/**
 * Whether to add the answers to the `stderr` and `stdout` output. Default `true`.
 * @type {(boolean|undefined)}
 */
_contextTesting.ForkConfig.prototype.includeAnswers
/**
 * Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result. Default `true`.
 * @type {(boolean|undefined)}
 */
_contextTesting.ForkConfig.prototype.stripAnsi
/**
 * The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.
 * @type {((_contextTesting.Preprocessor|_contextTesting.ForkPreprocessor)|undefined)}
 */
_contextTesting.ForkConfig.prototype.preprocess
/**
 * The function which processes fork's outputs before returning them for asserts.
 * @typedef {function(string): string}
 */
_contextTesting.Preprocessor
/**
 * An object with `stdout` and `stderr` preprocessors.
 * @typedef {{ stdout: (_contextTesting.Preprocessor|undefined), stderr: (_contextTesting.Preprocessor|undefined) }}
 */
_contextTesting.ForkPreprocessor
