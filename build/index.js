const { fork } = require('spawncommand');
let forkFeed = require('forkfeed'); if (forkFeed && forkFeed.__esModule) forkFeed = forkFeed.default;
const { getArgs, getForkArguments, assertForkOutput } = require('./lib');
const { PassThrough } = require('stream');
let Catchment = require('catchment'); if (Catchment && Catchment.__esModule) Catchment = Catchment.default;

/**
 * Run a fork.
 * @param {{forkConfig: string|ForkConfig, input: string, props: *, contexts?: Context[] }}
 */
const run = async ({
  forkConfig,
  input,
  props = {},
  contexts = [],
}) => {
  const a = input ? getArgs(input) : []
  const {
    mod, args, options,
  } = await getForkArguments(forkConfig, a, contexts)
  const { promise, stdout, stdin, stderr } = fork(mod, args, options)

  const { includeAnswers = true, log, inputs, stderrInputs } = forkConfig

  const stdoutLog = new PassThrough()
  const stderrLog = new PassThrough()

  if (log === true) {
    stdoutLog.pipe(process.stdout)
    stderrLog.pipe(process.stderr)
  } else if (log) {
    log.stdout && stdoutLog.pipe(log.stdout)
    log.stderr && stderrLog.pipe(log.stderr)
  }

  let co, ce
  if (includeAnswers) {
    co = new Catchment({ rs: stdoutLog })
    ce = new Catchment({ rs: stderrLog })
  }

  forkFeed(stdout, stdin, inputs, stdoutLog)
  forkFeed(stderr, stdin, stderrInputs, stderrLog)

  const res = await promise

  // override process's outputs with outputs with answers
  if (includeAnswers) {
    co.end(); const stdoutWithAnswers = await co.promise
    ce.end(); const stderrWithAnswers = await ce.promise
    Object.assign(res, {
      stdout: stdoutWithAnswers,
      stderr: stderrWithAnswers,
    })
  }

  assertFork(res, props)
  return res
}

const assertFork = ({ code, stdout, stderr }, props) => {
  assertForkOutput(stdout, props.stdout)
  assertForkOutput(stderr, props.stderr)
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
 * @prop {(args: string[], ...contexts?: Context[]) => string[]|Promise.<string[]>} [getArgs] The function to get arguments to pass the forked processed based on parsed masks input and contexts.
 * @prop {(...contexts?: Context[]) => ForkOptions} [getOptions] The function to get options for the forked processed, such as `ENV` and `cwd`, based on contexts.
 * @prop {ForkOptions} [options] Options for the forked processed, such as `ENV` and `cwd`.
 * @prop {[RegExp, string][]} [inputs] Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data.
 * @prop {[RegExp, string][]} [stderrInputs] Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`).
 * @prop {boolean|{stderr: Writable, stdout: Writable}} [log=false] Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. Default `false`.
 * @prop {boolean} [includeAnswers=false] Whether to add the answers to the `stderr` and `stdout` output. Default `false`.
 */
