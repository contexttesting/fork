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
 * @typedef {{ module: string, getArgs: (function(!Array<string>, ..._contextTesting.Context): !Array<string>|!Promise<!Array<string>>|undefined), getOptions: (function(..._contextTesting.Context): !child_process.ForkOptions|undefined), options: (!child_process.ForkOptions|undefined), inputs: (!Array<!Array<(!RegExp|string)>>|undefined), stderrInputs: (!Array<!Array<(!RegExp|string)>>|undefined), log: (boolean|{stderr: (stream.Writable|NodeJS.WriteStream), stdout: (stream.Writable|NodeJS.WriteStream)}|undefined), includeAnswers: (boolean|undefined), stripAnsi: (boolean|undefined), preprocess: (!(_contextTesting.Preprocessor|_contextTesting.ForkPreprocessor)|undefined) }}
 */
_contextTesting.ForkConfig
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
