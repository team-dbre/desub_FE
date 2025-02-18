'use server';

import { getUserSession } from './serverAction';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import type { Plan } from '@/types/plan';

// 유저 데이터 받아오는 함수
export const requestPayment = async (billingKey: string) => {
  const { accessToken } = await getUserSession();

  if (!accessToken) {
    console.log('엑세스 토큰이 없습니다.');
    return '엑세스 토큰이 없습니다.';
  }

  // 백엔드에 빌링키 저장
  const saveBillingKey = await fetch(`${API_BASE_URL}/api/payment/billing-key/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify({
      billing_key: billingKey,
    }),
  });

  if (!saveBillingKey.ok) {
    throw new Error(`HTTP error! Status: ${saveBillingKey.status}`);
  }

  // 플랜 조회
  const searchPlan = await fetch(`${API_BASE_URL}/api/plans/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!searchPlan.ok) {
    throw new Error(`HTTP error! Status: ${searchPlan.status}`);
  }

  const planData: Plan[] = await searchPlan.json();

  const activePlan = planData.find((plan: Plan) => plan.is_active === true);

  if (!activePlan) {
    throw new Error(`error! : 결제 가능한 구독 플랜이 없습니다.`);
  }

  // 결제 요청
  const response = await fetch(`${API_BASE_URL}/api/payment/subscribe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify({
      plan_id: activePlan.id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.error?.includes('이미 Plans object')) {
      return '이미 구독중입니다.';
    }
    return `HTTP error! Status: ${response.status}, Message: ${data.error}`;
  }

  return '구독결제가 완료되었습니다';
};

export const unsubscribed = async () => {};
