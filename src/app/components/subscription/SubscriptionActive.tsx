'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useAppDispatch } from '@/hooks/redux/hooks';
import { setSubscriptionStatus } from '../../../store/subscriptionStatusSlice';
import Image from 'next/image';
import { getUserSession } from '@/app/actions/serverAction';
import { statusSubscriptions } from '@/api/subscription';
import Unsubscription from './Unsubscription';
import { calculateRemainingDays, formatDate, formatDateShort } from '@/utils/dateUtils';

const SubscriptionActive = () => {
  const dispatch = useAppDispatch();
  const [subscriptionInfo, setSubscriptionInfo] = useState<string>('');
  const [nextBillDate, setNextBillDate] = useState<string>('');

  const handleSubscriptionStatus = () => {
    dispatch(setSubscriptionStatus('paused'));
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { accessToken } = await getUserSession();
        if (!accessToken) return;
        const response = await statusSubscriptions(accessToken);

        if (Array.isArray(response) && response.length > 0) {
          const subscription = response[0];

          if (subscription.sub_status === 'active') {
            const formattedEndDate = formatDateShort(subscription.end_date);
            const daysRemaining = calculateRemainingDays(subscription.end_date);
            setSubscriptionInfo(`~${formattedEndDate} / D-${daysRemaining}일 남음`);

            if (subscription.next_bill_date) {
              setNextBillDate(formatDate(subscription.next_bill_date));
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
  }, []);

  const handleUnsubscribe = () => {
    // 구독 취소 로직 - util 함수로 만들어서 SubscriptionActive와 SubscriptionPaused에 함께 쓸지 고민해보기
    console.log('구독 취소 로직');
  };

  return (
    <div>
      <div className="flex w-[40.1rem] justify-between">
        <p className="text-[5rem] font-bold">구독중</p>
        <Button
          className="w-[14.7rem] h-[6rem] font-bold text-[1.8rem] flex justify-center items-center gap-[0.6rem]"
          size="small"
          variant="outline"
          onClick={handleSubscriptionStatus}
        >
          <Image src="/icons/pause-circle.svg" alt="" width={24} height={24} />
          일시정지
        </Button>
      </div>
      <p className="text-[1.8rem] font-bold mt-[1.8rem]">{subscriptionInfo}</p>
      <div className="mt-[9.3rem]">
        <Unsubscription onUnsubscribe={handleUnsubscribe} nextBillDate={nextBillDate} />
      </div>
    </div>
  );
};

export default SubscriptionActive;
