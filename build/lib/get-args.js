const mismatch = require('mismatch');

/**
 * Return shell arguments from a string.
 * @param {string} input
 */
const getArgs = (input) => {
  const res = mismatch(/(['"])?([\s\S]+?)\1(\s+|$)/g, input, ['q', 'a'])
    .map(({ 'a': a }) => a)
  return res
}

module.exports=getArgs