const { c, b } = require('erte')

process.stdout.write(c('test-stdout', 'red'))
process.stderr.write(b('test-stderr', 'green'))