const [,, ...args] = process.argv
console.log(args)
console.error(process.env.EXAMPLE)
process.exit(5)