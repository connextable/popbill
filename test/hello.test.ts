import { foo } from '@/index'

describe('Hello', () => {
  it('should say hello', () => {
    expect(foo()).toBe('foo')
  })
})
