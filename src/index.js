import { fork } from 'spawncommand'
import forkFeed from 'forkfeed'
import Catchment from 'catchment'
import { PassThrough } from 'stream'
import { getForkArguments, assertForkOutput } from './lib'
import getArgs from './lib/get-args'

/**
 * @type {_contextTesting.fork}
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

  /**
   * @suppress {checkTypes}
   * @type {stream.Writable}
   */
  const _stdoutLog = stdoutLog
  /**
   * @suppress {checkTypes}
   * @type {stream.Writable}
   */
  const _stderrLog = stderrLog
  forkFeed(stdout, stdin, inputs, _stdoutLog)
  forkFeed(stderr, stdin, stderrInputs, _stderrLog)

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

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').fork} _contextTesting.fork
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('stream').Readable} stream.Readable
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('stream').Writable} stream.Writable
 */