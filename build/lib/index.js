const { deepEqual } = require('assert-diff');
let erte = require('erte'); if (erte && erte.__esModule) erte = erte.default;
const { equal } = require('assert');

       const assertExpected = (result, expected) => {
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(expected, result)
    console.log(e) // eslint-disable-line no-console
    throw err
  }
}

/**
 * @param {string|ForkConfig} forkConfig Parameters for forking.
 * @param {string} forkConfig.module The path to the module to fork.
 * @param {(args: string[], ...contexts?: Context[]) => string[]|Promise.<string[]>} [forkConfig.getArgs] The function to get arguments to pass the forked processed based on parsed masks input and contexts.
 * @param {(...contexts?: Context[]) => ForkOptions} [forkConfig.getOptions] The function to get options for the forked processed, such as `ENV` and `cwd`, based on contexts.
 * @param {ForkOptions} [forkConfig.options] Options for the forked processed, such as `ENV` and `cwd`.
 * @param {string[]} args
 * @param {Context[]} contexts
 * @param {*} props The props found in the mask.
 */
       const getForkArguments = async (forkConfig, args = [], context = [], props = {}) => {
  /**
   * @type {ForkOptions}
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
    if (prop) err.property = prop
    throw err
  }
}

/**
 * @typedef {import('..').Context} Context
 * @typedef {import('..').ForkOptions} ForkOptions
 * @typedef {import('..').ForkConfig} ForkConfig
 */

module.exports.assertExpected = assertExpected
module.exports.getForkArguments = getForkArguments
module.exports.assertForkOutput = assertForkOutput