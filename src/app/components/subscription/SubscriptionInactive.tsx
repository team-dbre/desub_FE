import { Button } from '../ui/Button';
import { useAppDispatch } from '@/hooks/redux/hooks';
import { setSubscriptionStatus } from '../../../store/subscriptionStatusSlice';

const Unsubscribed = () => {
  const dispatch = useAppDispatch();

  const handleSubscriptionStatus = () => {
    dispatch(setSubscriptionStatus('subscribed'));
  };

  return (
    <div>
      <div className="flex w-[40.1rem] justify-between">
        <p className="text-[5rem] font-bold">미구독</p>
      </div>
      <Button
        className="w-[20.9rem] h-[6rem] border border-black font-bold text-[1.8rem] mt-[6.7rem]"
        size="small"
        variant="green"
        onClick={handleSubscriptionStatus}
      >
        구독하기
      </Button>
    </div>
  );
};

export default Unsubscribed;
