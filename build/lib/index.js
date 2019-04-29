let deepEqual = require('@zoroaster/deep-equal'); if (deepEqual && deepEqual.__esModule) deepEqual = deepEqual.default;
let erte = require('erte'); if (erte && erte.__esModule) erte = erte.default;
const { strictEqual } = require('assert');

       const assertExpected = (result, expected) => {
  try {
    strictEqual(result, expected)
  } catch (err) {
    const e = erte(expected, result)
    console.log(e) // eslint-disable-line no-console
    throw err
  }
}

/**
 * @param {string|!_contextTesting.ForkConfig} forkConfig Parameters for forking.
 * @param {!Array<string>} args The arguments to the fork
 * @param {!Array<!_contextTesting.Context>} contexts The array of contexts.
 * @param {*} props The props found in the mask.
 */
       const getForkArguments = async (forkConfig, args = [], context = [], props = {}) => {
  /**
   * @type {!child_process.ForkOptions}
   */
  const stdioOpts = {
    stdio: 'pipe',
    execArgv: [],
  }
  if (typeof forkConfig == 'string') {
    return {
      mod: forkConfig,
      args,
      options: stdioOpts,
    }
  }
  const {
    module: mod,
    getArgs,
    options,
    getOptions,
  } = forkConfig
  const a = getArgs ? await getArgs.call(props, args, ...context) : args
  let opt = stdioOpts
  if (options) {
    opt = {
      ...stdioOpts,
      ...options,
    }
  } else if (getOptions) {
    const o = await getOptions.call(props, ...context)
    opt = {
      ...stdioOpts,
      ...o,
    }
  }
  return {
    mod,
    args: a,
    options: opt,
  }
}

       const assertForkOutput = (actual, expected, prop) => {
  try {
    if (typeof expected == 'string') {
      assertExpected(actual, expected)
    } else if (expected) {
      const a = JSON.parse(actual)
      deepEqual(a, expected)
    }
  } catch (err) {
    // set 'property' to interactively update masks on fail via @zoroaster/mask
    if (prop) err['property'] = prop
    throw err
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('child_process').ForkOptions} child_process.ForkOptions
 */
/**
 * @typedef {import('..').Context} _contextTesting.Context
 * @typedef {import('..').ForkConfig} _contextTesting.ForkConfig
 */

module.exports.assertExpected = assertExpected
module.exports.getForkArguments = getForkArguments
module.exports.assertForkOutput = assertForkOutput