import { fork } from 'spawncommand'
import forkFeed from 'forkfeed'
import { getForkArguments, assertForkOutput } from './lib'
import getArgs from './lib/get-args'
import { PassThrough } from 'stream'
import Catchment from 'catchment'

/**
 * Run a fork.
 * @param {!_contextTesting.RunFork} config Options for the run method.
 * @param {string|!_contextTesting.ForkConfig} config.forkConfig Either the config, or the path to the module to fork.
 * @param {string} config.input The input to the test from the test mask to set on the `this.input` property of the `getArgs` and `getOptions`.
 * @param {*} [config.props] The properties to pass to the `getArgs` and `getOptions` as their this context. These properties will be got from the mask's result.
 * @param {!Array<_contextTesting.Context>} [config.contexts] The contexts for the test to be passed to `getArgs` and `getOptions`.
 * @returns {Promise<{stdout: string, stderr: string, code: number}>} The result of the work, updated to contain answers in the interactive mode.
 */
const run = async (config) => {
  const {
    forkConfig,
    input,
    props = {},
    contexts = [],
  } = config
  const a = input ? getArgs(input) : []
  const {
    mod, args, options,
  } = await getForkArguments(forkConfig, a, contexts, {
    ...props,
    input,
  })
  const { promise, stdout, stdin, stderr } = fork(mod, args, options)

  const { includeAnswers = true, log, inputs, stderrInputs, stripAnsi = true, preprocess } = forkConfig

  const stdoutLog = new PassThrough()
  const stderrLog = new PassThrough()

  if (log === true) {
    stdoutLog.pipe(process.stdout)
    stderrLog.pipe(process.stderr)
  } else if (log) {
    log.stdout && stdoutLog.pipe(log.stdout)
    log.stderr && stderrLog.pipe(log.stderr)
  }

  const needsStdoutAnswers = includeAnswers && inputs
  const needsStderrAnswers = includeAnswers && stderrInputs

  let co, ce
  if (needsStdoutAnswers) co = new Catchment({ rs: stdoutLog })
  if (needsStderrAnswers) ce = new Catchment({ rs: stderrLog })

  forkFeed(stdout, stdin, inputs, stdoutLog)
  forkFeed(stderr, stdin, stderrInputs, stderrLog)

  const res = await promise

  // override process's outputs with outputs with answers
  if (needsStdoutAnswers) {
    co.end(); const stdoutWithAnswers = await co.promise
    Object.assign(res, {
      stdout: stdoutWithAnswers,
    })
  }
  if (needsStderrAnswers) {
    ce.end(); const stderrWithAnswers = await ce.promise
    Object.assign(res, {
      stderr: stderrWithAnswers,
    })
  }

  assertFork(res, props, stripAnsi, preprocess)
  return res
}

const assertFork = ({ code, stdout, stderr }, props, stripAnsi, preprocess) => {
  let stdoutPre, stderrPre
  if (typeof preprocess == 'object') {
    ({ stdout: stdoutPre, stderr: stderrPre } = preprocess)
  } else if (typeof preprocess == 'function') {
    stdoutPre = stderrPre = preprocess
  }
  stdout = stdout.replace(/\r?\n$/, '')
  stderr = stderr.replace(/\r?\n$/, '')
  const o = stripAnsi ? stdout.replace(/\033\[.*?m/g, '') : stdout
  const e = stripAnsi ? stderr.replace(/\033\[.*?m/g, '') : stderr
  const op = stdoutPre ? stdoutPre(o) : o
  const ep = stderrPre ? stderrPre(e) : e
  assertForkOutput(op, props.stdout, 'stdout')
  assertForkOutput(ep, props.stderr, 'stderr')
  if (props.code && code != props.code) {
    const err =
      new Error(`Fork exited with code ${code} != ${props.code}`)
    err.property = 'code'
    throw err
  }
}

export default run

/* documentary types/context.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_contextTesting.Context} Context A context made with a constructor.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _contextTesting.Context A context made with a constructor.
 * @prop {function(): !Promise|void} [_init] The function to initialise the context.
 * @prop {function(): !Promise|void} [_destroy] The function to destroy the context.
 */

/* documentary types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_contextTesting.ForkConfig} ForkConfig Parameters for forking.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _contextTesting.ForkConfig Parameters for forking.
 * @prop {string} module The path to the module to fork.
 * @prop {function(!Array<string>, ..._contextTesting.Context): !Array<string>|!Promise<!Array<string>>} [getArgs] The function to get arguments to pass the fork based on the parsed mask input and contexts.
 * @prop {function(..._contextTesting.Context): !child_process.ForkOptions} [getOptions] The function to get options for the fork, such as `ENV` and `cwd`, based on contexts.
 * @prop {!child_process.ForkOptions} [options] Options for the forked processed, such as `ENV` and `cwd`.
 * @prop {!Array<!Array<(!RegExp|string)>>} [inputs] Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @prop {!Array<!Array<(!RegExp|string)>>} [stderrInputs] Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @prop {boolean|{stderr: Writable, stdout: Writable}} [log=false] Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. Default `false`.
 * @prop {boolean} [includeAnswers=true] Whether to add the answers to the `stderr` and `stdout` output. Default `true`.
 * @prop {boolean} [stripAnsi=true] Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result. Default `true`.
 * @prop {!(Preprocessor|ForkPreprocessor)} [preprocess] The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_contextTesting.Preprocessor} Preprocessor The function which processes fork's outputs before returning them for asserts.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {function(string): string} _contextTesting.Preprocessor The function which processes fork's outputs before returning them for asserts.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_contextTesting.ForkPreprocessor} ForkPreprocessor An object with `stdout` and `stderr` preprocessors.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _contextTesting.ForkPreprocessor An object with `stdout` and `stderr` preprocessors.
 * @prop {function(string): string} [stdout] </prop>
    <prop opt type="function(string): string" name="stderr">
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('child_process').ForkOptions} child_process.ForkOptions
 */

/* documentary types/run.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_contextTesting.RunFork} RunFork Options for the run method.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _contextTesting.RunFork Options for the run method.
 * @prop {string|!_contextTesting.ForkConfig} forkConfig Either the config, or the path to the module to fork.
 * @prop {string} input The input to the test from the test mask to set on the `this.input` property of the `getArgs` and `getOptions`.
 * @prop {*} [props] The properties to pass to the `getArgs` and `getOptions` as their this context. These properties will be got from the mask's result.
 * @prop {!Array<_contextTesting.Context>} [contexts] The contexts for the test to be passed to `getArgs` and `getOptions`.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_contextTesting.ForkResult} ForkResult
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _contextTesting.ForkResult
 * @prop {string} stdout The output from the `stdout` stream, possibly with answers fed to `stdin`.
 * @prop {string} stderr The output from the `stderr` stream,  possibly with answers fed to `stdin`.
 * @prop {number} code The code with which the process exited.
 */
