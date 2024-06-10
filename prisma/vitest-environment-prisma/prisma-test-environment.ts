import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('setup')

    return {
      async teardown() {
        console.log('teardown')
      },
    }
  },
}
