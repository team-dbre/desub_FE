'use client';

import { useEffect } from 'react';
import Heading from '@/app/components/ui/Heading';
import { BackButton } from '@/app/components/ui/BackButton';
import { Button } from '@/app/components/ui/Button';
import { priceText } from '@/constants/price';
import { useUserDataFetch } from '@/hooks/useUserDataFetch';
import { createBillingKey } from '@/app/actions/paymentAction';
const PORTONE_API_SECRET = process.env.NEXT_PUBLIC_PORTONE_API_SECRET;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import * as PortOne from '@portone/browser-sdk/v2';

const Subscribe = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const billingKey = urlParams.get('billingKey');
  const { userData, getUserData } = useUserDataFetch();

  if (billingKey) {
    console.log('서버에서 받은 Billing Key:', billingKey);
  }

  useEffect(() => {
    getUserData();
  }, []);

  const handlePayment = async () => {
    try {
      const issueResponse = await PortOne.requestIssueBillingKey({
        storeId: 'store-c25c9523-5081-4aae-a882-ce7e52479c59',
        channelKey: 'channel-key-8bc12c40-b958-4151-ae85-98c129a80099',
        billingKeyMethod: 'CARD',
        issueId: `ISSUE${Date.now()}`,
        customer: {
          fullName: userData?.name,
          // fullName: '한효찬',
        },
      });

      const paymentData = await createBillingKey(issueResponse?.billingKey as string);
      const billing_key = paymentData?.billing_key.billing_key;
      const paymentId = `${Date.now()}`;

      const paymentResponse = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/billing-key`,
        {
          method: 'POST',
          headers: {
            Authorization: `PortOne ${PORTONE_API_SECRET}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            billingKey: billing_key,
            orderName: '월간 이용권 정기결제',
            customer: {
              fullName: userData?.name,
            },
            amount: {
              total: paymentData?.planData[0].price,
            },
            currency: 'KRW',
          }),
        },
      );

      if (!paymentResponse.ok) {
        const errorResponse = await paymentResponse.json();
        throw new Error(`paymentResponse: ${JSON.stringify(errorResponse)}`);
      }

      // const paymentResponse = await PortOne.requestPayment({
      //   storeId: 'store-c25c9523-5081-4aae-a882-ce7e52479c59',
      //   channelKey: 'channel-key-8bc12c40-b958-4151-ae85-98c129a80099',
      //   paymentId: paymentId,
      //   orderName: paymentData?.planData[0].plan_name,
      //   totalAmount: paymentData?.planData[0].price,
      //   currency: 'CURRENCY_KRW',
      //   payMethod: 'CARD',
      //   billingKey: paymentData?.billing_key.billing_key,
      //   extra: {
      //     pg: 'kpn',
      //     method: 'card',
      //     name: 'KPN 정기결제',
      //     showResult: true,
      //   },
      // });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full">
      <div className="pt-[4.7rem] pl-[4.7rem]">
        <BackButton text="Subscribe" />
      </div>

      <div className="flex flex-col justify-center items-center mt-[6rem] md:mt-[10rem]">
        <div className="w-[35.5rem] md:w-[54rem] p-[3rem] border">
          <Heading tag="h1" className="!text-[4rem] md:!text-[5rem] leading-normal">
            Standard
          </Heading>
          <ul className="mt-[5rem]">
            <li className="flex justify-between">
              <span className="text-[1.6rem]">매달 결제</span>
              <span className="text-right font-medium">
                {priceText.toLocaleString()}/월
                <br />
                (VAT 포함)
              </span>
            </li>
          </ul>
        </div>

        <div className="w-[31.1rem] md:w-[50.5rem] mt-[5rem]">
          <p className="mb-[0.7rem] text-right">1,575,000원/월</p>
          <p className="flex justify-between font-medium text-[1.5rem] pb-[2.2rem] border-b">
            <span className="font-normal">VAT 10%</span>
            <span>157,500원/월</span>
          </p>
          <p className="flex justify-between mt-[2.2rem]">
            <span className="font-bold">결제</span>
            <span className="text-[2.5rem] md:text-[3rem] text-right">
              <span className="font-bold">{priceText.toLocaleString()}원</span>/월
              <br />
              <span className="font-normal text-[1.6rem]">(VAT 포함)</span>
            </span>
          </p>
        </div>

        <Button
          variant="green"
          type="button"
          className="w-[40rem] h-[5.5rem] text-[1.6rem] mt-[9rem]"
          onClick={handlePayment}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default Subscribe;
