/* yarn example/ */
import fork from '../src'

(async () => {
  const res = await fork({
    text: 'example',
  })
  console.log(res)
})()