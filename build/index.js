const { fork } = require('spawncommand');
let forkFeed = require('forkfeed'); if (forkFeed && forkFeed.__esModule) forkFeed = forkFeed.default;
const { getForkArguments, assertForkOutput } = require('./lib');
const getArgs = require('./lib/get-args');
const { PassThrough } = require('stream');
let Catchment = require('catchment'); if (Catchment && Catchment.__esModule) Catchment = Catchment.default;

/**
 * Run a fork.
 * @param {Run} config Options for the run method.
 * @param {(string|ForkConfig)} config.forkConfig Either the config, or the path to the module to fork.
 * @param {string} config.input The input to the test from the test mask to set on the `this.input` property of the `getArgs` and `getOptions`.
 * @param {*} [config.props="{}"] The properties to pass to the `getArgs` and `getOptions` as their this context. Default `{}`.
 * @param {Array<Context>} [config.contexts="[]"] The contexts for the test to be passed to `getArgs` and `getOptions`. Default `[]`.
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
  assertForkOutput(op, props.stdout)
  assertForkOutput(ep, props.stderr)
  if (props.code && code != props.code)
    throw new Error(`Fork exited with code ${code} != ${props.code}`)
}

module.exports=run

/* documentary types/context.xml */
/**
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 */

/* documentary types/index.xml */
/**
 * @typedef {import('child_process').ForkOptions} ForkOptions
 *
 * @typedef {Object} ForkConfig Parameters for forking.
 * @prop {string} module The path to the module to fork.
 * @prop {(args: string[], ...contexts?: Context[]) => string[]|Promise.<string[]>} [getArgs] The function to get arguments to pass the fork based on the parsed mask input and contexts.
 * @prop {(...contexts?: Context[]) => ForkOptions} [getOptions] The function to get options for the fork, such as `ENV` and `cwd`, based on contexts.
 * @prop {ForkOptions} [options] Options for the forked processed, such as `ENV` and `cwd`.
 * @prop {[RegExp, string][]} [inputs] Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data.
 * @prop {[RegExp, string][]} [stderrInputs] Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`).
 * @prop {boolean|{stderr: Writable, stdout: Writable}} [log=false] Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. Default `false`.
 * @prop {boolean} [includeAnswers=true] Whether to add the answers to the `stderr` and `stdout` output. Default `true`.
 * @prop {boolean} [stripAnsi=true] Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result. Default `true`.
 * @prop {(function|{stdout?:function, stderr?:function})} [preprocess] The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.
 */

/* documentary types/run.xml */
/**
 * @typedef {Object} Run Options for the run method.
 * @prop {(string|ForkConfig)} forkConfig Either the config, or the path to the module to fork.
 * @prop {string} input The input to the test from the test mask to set on the `this.input` property of the `getArgs` and `getOptions`.
 * @prop {*} [props="{}"] The properties to pass to the `getArgs` and `getOptions` as their this context. Default `{}`.
 * @prop {Array<Context>} [contexts="[]"] The contexts for the test to be passed to `getArgs` and `getOptions`. Default `[]`.
 */
