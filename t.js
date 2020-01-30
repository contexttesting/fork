import t from './'

t({
  forkConfig: {
    preprocess: {
      stderr(stdout) {
        return stdout.replace(' ', '')
      },
    },
  },
})