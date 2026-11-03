import { compactOptionalObject, removeUndefinedProperties } from '@/index'

describe('undefined property utilities', () => {
  test('removes only top-level undefined properties without changing the source', () => {
    const nested = { optional: undefined, nullable: null }
    const source = Object.freeze({ optional: undefined, nullable: null, blank: '', flag: false, zero: 0, nested })

    const compacted = removeUndefinedProperties(source)

    expect(compacted).toEqual({ nullable: null, blank: '', flag: false, zero: 0, nested })
    expect(compacted).not.toBe(source)
    expect(compacted.nested).toBe(nested)
    expect(source).toHaveProperty('optional', undefined)
  })

  test('omits optional objects only when no defined fields remain', () => {
    expect(compactOptionalObject({})).toBeUndefined()
    expect(compactOptionalObject({ missing: undefined })).toBeUndefined()
    expect(compactOptionalObject({ nullable: null, blank: '', flag: false, zero: 0 })).toEqual({
      nullable: null,
      blank: '',
      flag: false,
      zero: 0,
    })
  })
})
