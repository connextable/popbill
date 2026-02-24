import { createLinkhubAuthClient } from '@/internal/linkhub'

const linkId = process.env['POPBILL_LINK_ID']?.trim()
const secretKey = process.env['POPBILL_SECRET_KEY']?.trim()
const businessNumber = process.env['POPBILL_CORP_NUM']?.trim()
const shouldRunIntegration = process.env['POPBILL_RUN_INTEGRATION_TESTS'] === 'true'

const isRunnable = shouldRunIntegration && Boolean(linkId && secretKey && businessNumber)
const testable = isRunnable ? test : test.skip

describe('integration linkhub issueToken', () => {
  testable('issues a real auth token from linkhub', async () => {
    const authClient = createLinkhubAuthClient({
      linkId: linkId as string,
      secretKey: secretKey as string,
      useStaticIp: false,
      useGaIp: false,
      useLocalTime: true,
      timeoutMs: 180_000,
    })

    const result = await authClient.issueToken({
      serviceId: 'POPBILL_TEST',
      accessId: businessNumber as string,
      scopes: ['member', '110'],
    })

    expect(result).toMatchObject({
      sessionToken: expect.any(String),
      serviceId: 'POPBILL_TEST',
      expiredAt: expect.any(String),
    })
  })
})
