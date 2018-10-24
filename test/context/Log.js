const originalStdout = process.stdout.write.bind(process.stdout)
const originalStderr = process.stderr.write.bind(process.stdout)

export default class Log {
  constructor() {
    this.stdout = []
    this.stderr = []
  }
  async _init() {
    process.stdout.write = (...args) => {
      const a = args.map(aa => `${aa}`)
      this.stdout.push(...a)
      // originalStdout(...args)
    }
    process.stderr.write = (...args) => {
      const a = args.map(aa => `${aa}`)
      this.stderr.push(...a)
      // originalStderr(...args)
    }
  }
  async _destroy() {
    process.stdout.write = originalStdout
    process.stderr.write = originalStderr
  }
  getStdout() {
    return this.stdout
  }
  getStderr() {
    return this.stderr
  }
}