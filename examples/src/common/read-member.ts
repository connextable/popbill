import { createPopbillClient } from '@connextable/popbill'

/** 회원·포인트 조회 예제입니다. 회원가입·결제·환불 요청은 실행하지 않습니다. */
export async function readMember() {
  const client = createPopbillClient({
    linkId: process.env.POPBILL_LINK_ID ?? '',
    secretKey: process.env.POPBILL_SECRET_KEY ?? '',
    userId: process.env.POPBILL_USER_ID ?? '',
    isTest: true,
  })
  const request = { businessNumber: process.env.POPBILL_CORP_NUM ?? '' }
  const membership = await client.services.common.checkMemberRegistration(request)
  if (!membership.isMember) return { membership }
  return {
    membership,
    company: await client.services.common.getCompanyInfo(request),
    balance: await client.services.common.getMemberPointBalance(request),
  }
}
