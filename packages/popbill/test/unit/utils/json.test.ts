import { stringifyWithoutEmptyValues } from '@/utils/json'

describe('stringifyWithoutEmptyValues', () => {
  test('removes null, empty string, undefined values', () => {
    const payload = {
      invoiceManagementKey: 'abc',
      emptyString: '',
      nullable: null,
      optional: undefined,
      keepFalse: false,
      keepZero: 0,
    }

    const serialized = stringifyWithoutEmptyValues(payload)

    expect(serialized).toBe('{"invoiceManagementKey":"abc","keepFalse":false,"keepZero":0}')
  })
})
