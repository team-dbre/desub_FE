import { useState } from 'react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Confirm } from '../ui/Confirm';
import Image from 'next/image';
import { SubscriptionCancelReason, UnSubscriptionReason } from '@/types/profiles';

const Unsubscribed = () => {
  const [firstCheckModal, setFirstCheckModal] = useState(false);
  const [subscriptionModal, setSubscriptionModal] = useState(false);
  const [isEtc, setIsEtc] = useState(false);
  const [etcContents, setEtcContents] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [lastCheckModal, setLastCheckModal] = useState(false);

  const selectedReasonInitialValue: SubscriptionCancelReason = {
    cancelled_reason: [],
    other_reason: '',
  };

  const [selectedReason, setSelectedReason] = useState(selectedReasonInitialValue);

  const handleSubscriptionStatus = () => {};

  const unSubscriptionReasons: UnSubscriptionReason[] = [
    { id: 'expensive', label: '가격이 비싸서' },
    { id: 'quality', label: '퀄리티가 마음에 들지 않아서' },
    { id: 'communication', label: '소통이 느려서' },
    { id: 'hiring', label: '정직원을 구하는 것이 더 편해서' },
    { id: 'budget', label: '회사예산이 줄어들어서' },
    { id: 'etc', label: '기타' },
  ];

  const handleFirstCheck = () => {
    setFirstCheckModal(false);
    setSubscriptionModal(true);
    setSelectedReason(selectedReasonInitialValue);
    setIsEtc(false);
    setEtcContents('');
    setWarningMessage('');
  };

  const handleSelectedReason = (item: UnSubscriptionReason) => {
    setWarningMessage('');
    setSelectedReason(prev => {
      const isSelected = prev.cancelled_reason.includes(item.id);

      if (isSelected) {
        if (item.id === 'etc') {
          setIsEtc(false);
        }
        return {
          ...prev,
          cancelled_reason: prev.cancelled_reason.filter(reason => reason !== item.id),
        };
      } else {
        if (prev.cancelled_reason.length >= 3) {
          setWarningMessage('구독취소 사유는 최대 3개까지 선택 가능합니다.');
          return prev;
        }
        if (item.id === 'etc') {
          setIsEtc(true);
          return {
            ...prev,
            cancelled_reason: [...prev.cancelled_reason, item.id],
            other_reason: etcContents,
          };
        }
        return {
          ...prev,
          cancelled_reason: [...prev.cancelled_reason, item.id],
        };
      }
    });
  };

  const handleEtcContents = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setEtcContents(content);
    if (content.trim() !== '') {
      setWarningMessage('');
    }
    setSelectedReason(prev => ({
      ...prev,
      other_reason: content,
    }));
  };

  const handleSubscriptionReasonSubmit = () => {
    if (selectedReason.cancelled_reason.length === 0) {
      setWarningMessage('구독취소 사유를 선택해주세요.');
      return;
    }
    if (isEtc && etcContents.trim() === '') {
      setWarningMessage('기타 사유를 입력해주세요.');
      return;
    }
    setSubscriptionModal(false);
    setLastCheckModal(true);
  };

  const handleSubscriptionReasonModalClose = () => {
    setSubscriptionModal(false);
    setIsEtc(false);
    setEtcContents('');
    setWarningMessage('');
  };

  const handleLastCheckSubmit = () => {
    setLastCheckModal(false);
    console.log(selectedReason);
  };

  const handleLastCheckModalClose = () => {
    setLastCheckModal(prev => !prev);
  };

  return (
    <div>
      <div className="flex w-[40.1rem] justify-between">
        {firstCheckModal && (
          <Confirm
            buttonText1="구독유지"
            buttonText2="구독취소"
            contents={
              <p className="mt-[1.6rem]">
                구독을 취소하면 YYYY년 MM월 DD에
                <br />
                결제되지 않습니다.
              </p>
            }
            title="정말 구독을 취소하시겠습니까?"
            variant1="outline"
            variant2="green"
            onClose={() => setFirstCheckModal(false)}
            onCancel={() => setFirstCheckModal(false)}
            onSubmit={handleFirstCheck}
          />
        )}
        {subscriptionModal && (
          <Alert
            buttonText="구독취소"
            contents={
              <div className="pt-[4rem] pb-[4rem] flex flex-col gap-[2rem]">
                <div className="flex flex-col gap-2">
                  {unSubscriptionReasons.map(item => (
                    <label key={item.id} className="flex items-center gap-[0.9rem]">
                      <input
                        type="checkbox"
                        checked={selectedReason.cancelled_reason.includes(item.id)}
                        onChange={() => handleSelectedReason(item)}
                        className="peer hidden"
                      />
                      <span className="w-[2.3rem] h-[2.3rem] border-2 border-black rounded-sm peer-checked:bg-black peer-checked:border-black"></span>
                      <span className="text-[1.6rem]">{item.label}</span>
                    </label>
                  ))}
                </div>
                {isEtc && (
                  <textarea
                    className="w-full h-[20.7rem] border border-black p-[1rem]"
                    onChange={handleEtcContents}
                    value={etcContents}
                    placeholder="여기에 구독취소 사유를 작성해주세요."
                  ></textarea>
                )}
                {warningMessage && (
                  <div className="text-red text-[1.6rem] text-left">{warningMessage}</div>
                )}
              </div>
            }
            title={
              <>
                벌써 떠나시나요? 다시 오실거죠?
                <br />
                구독취소 사유를 알려주시면 서비스 개선에 참고하겠습니다.
              </>
            }
            size="normal"
            variant="green"
            onClose={() => handleSubscriptionReasonModalClose()}
            onSubmit={handleSubscriptionReasonSubmit}
            className="w-[60rem] min-h-[53.7rem]"
          />
        )}
        {lastCheckModal && (
          <Alert
            buttonText="확인"
            title={<p>구독 취소가 완료되었습니다.</p>}
            size="full"
            variant="outline"
            onClose={() => handleLastCheckModalClose()}
            onSubmit={handleLastCheckSubmit}
          />
        )}
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
      <p className="text-[1.8rem] font-bold mt-[1.8rem]">~2025.06.12 / D-593일 남음</p>
      <div className="mt-[9.3rem]">
        <button onClick={() => setFirstCheckModal(true)} className="text-[1.8rem] underline">
          구독취소
        </button>
      </div>
    </div>
  );
};

export default Unsubscribed;
