/* typal types/index.xml */
/** @const */
var _contextTesting = {}
/**
 * Parameters for forking.
 * @typedef {{ module: string, getArgs: (function(!Array<string>, ..._contextTesting.Context): !Array<string>|!Promise<!Array<string>>|undefined), getOptions: (function(..._contextTesting.Context): !child_process.ForkOptions|undefined), options: (!child_process.ForkOptions|undefined), inputs: (!Array<!Array<(!RegExp|string)>>|undefined), stderrInputs: (!Array<!Array<(!RegExp|string)>>|undefined), log: (boolean|{stderr: Writable, stdout: Writable}|undefined), includeAnswers: (boolean|undefined), stripAnsi: (boolean|undefined), preprocess: (!(Preprocessor|ForkPreprocessor)|undefined) }}
 */
_contextTesting.ForkConfig
/**
 * The function which processes fork's outputs before returning them for asserts.
 * @typedef {function(string): string}
 */
_contextTesting.Preprocessor
/**
 * An object with `stdout` and `stderr` preprocessors.
 * @typedef {{ stdout: (function(string): string|undefined) }}
 */
_contextTesting.ForkPreprocessor
