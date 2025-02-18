'use client';

import type React from 'react';
import { BackButton } from '@/app/components/ui/BackButton';
import { Button } from '../components/ui/Button';
import TextButton from '../components/ui/TextButton';
import { useState, useEffect } from 'react';
import SubscriptionInactive from '../components/subscription/SubscriptionInactive';
import SubscriptionActive from '../components/subscription/SubscriptionActive';
import SubscriptionPaused from '../components/subscription/SubscriptionPaused';
import { SimpleAlert } from '../components/ui/SimpleAlert';
import Image from 'next/image';
import { Alert } from '../components/ui/Alert';
import Rating from 'react-rating';
import '../../styles/review.css';
import { useRouter } from 'next/navigation';
import { useUserDataFetch } from '@/hooks/useUserDataFetch';

const example = [
  {
    logTime: '2025-01-15 15:30',
    changeLog: '재개',
  },
  {
    logTime: '2025-02-15 15:30',
    changeLog: '일시정지',
  },
];

const Subscription = () => {
  const [subscriptionStatusModal, setSubscriptionStatusModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    contents: '',
  });
  const [reviewContents, setReviewContents] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [lastCheckModal, setLastCheckModal] = useState(false);
  const [isBlinking, setIsBlinking] = useState<boolean>(true);
  const router = useRouter();
  const { userData, getUserData } = useUserDataFetch();

  useEffect(() => {
    getUserData();
  }, []);

  const handleStarHover = () => {
    setIsBlinking(false);
  };

  const handleStarLeave = () => {
    if (!reviewModal) {
      setIsBlinking(true);
    }
  };

  const handleStatus = () => {
    switch (userData?.sub_status) {
      case 'none':
        return <SubscriptionInactive />;
      case 'active':
        return <SubscriptionActive />;
      case 'paused':
        return <SubscriptionPaused />;
      default:
        return <SubscriptionInactive />;
    }
  };

  // 리뷰 관리
  const handleReviewContents = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setReviewContents(e.target.value);
    if (content.trim() !== '') {
      setWarningMessage('');
      setReview(prev => ({ ...prev, contents: content }));
    }
  };

  const openReviewModal = () => {
    setIsBlinking(false);
    setReviewModal(true);
  };

  const closeReviewModal = () => {
    resetReview();
    if (!reviewModal) {
      setIsBlinking(true);
    }
  };

  // 리뷰 리셋
  const resetReview = () => {
    setIsBlinking(true);
    setReviewModal(false);
    setWarningMessage('');
    setReview({
      rating: 0,
      contents: '',
    });
  };

  // 최종 제출
  const handleReviewSubmit = () => {
    if (reviewContents.trim() === '') {
      setWarningMessage('후기 내용을 입력해주세요.');
      return;
    }
    console.log(review);
    resetReview();
    setLastCheckModal(true);
  };

  const goToTrelloLink = () => (window.location.href = 'https://trello.com/b/8NZhWTI4/desub');

  return (
    <div className="h-full">
      {reviewModal && (
        <Alert
          buttonText="작성완료"
          contents={
            <div className="pb-[4rem] flex flex-col items-center gap-[2rem]">
              <Rating
                emptySymbol={<p className="text-[5rem]">☆</p>}
                fullSymbol={<p className="text-[5rem]">★</p>}
                initialRating={review.rating}
                onChange={value => setReview(prev => ({ ...prev, rating: value }))}
                className="flex gap-2"
              />
              <textarea
                className="w-full h-[20.7rem] border border-black p-[1rem]"
                onChange={handleReviewContents}
                value={review.contents}
                placeholder="여기에 솔직한 후기를 작성해주세요."
              ></textarea>
              {warningMessage && (
                <div className=" w-full">
                  <p className="text-red text-[1.6rem]">{warningMessage}</p>
                </div>
              )}
            </div>
          }
          title={
            <>
              구독기간 중 언제든 리뷰를 작성하실 수 있어요.
              <br />
              작성된 리뷰는 서비스 개선에 참고하겠습니다.
            </>
          }
          size="normal"
          variant="green"
          onClose={closeReviewModal}
          onSubmit={handleReviewSubmit}
          className="w-[60rem] min-h-[60.4rem]"
        />
      )}
      {lastCheckModal && (
        <Alert
          buttonText="확인"
          title={<p>소중한 의견 감사합니다.</p>}
          size="full"
          variant="outline"
          onClose={() => setLastCheckModal(false)}
          onSubmit={() => setLastCheckModal(false)}
        />
      )}
      {subscriptionStatusModal && (
        <SimpleAlert
          contents={
            <div className="w-full h-[15rem] flex flex-col overflow-hidden">
              <div className="flex pb-[1.9rem] text-[1.5rem] font-bold">
                <div className="w-3/4">
                  <p>일시</p>
                </div>
                <div className="w-1/4">
                  <p>내용</p>
                </div>
              </div>
              <div className="flex flex-col gap-[1.5rem] text-[1.5rem] overflow-y-auto">
                {example.map((item, index) => (
                  <div key={index} className="flex items-center text-medium">
                    <div className="w-3/4">{item.logTime}</div>
                    <div className="w-1/4">{item.changeLog}</div>
                  </div>
                ))}
              </div>
            </div>
          }
          title="구독현황 변경 및 결제이력"
          onClose={() => setSubscriptionStatusModal(false)}
          className="w-[50rem] max-h-[30.5rem]"
        />
      )}
      <div className="pt-[4.7rem] px-[4.7rem] flex justify-between">
        <BackButton text="my subscription" />
        <div className="flex items-center">
          <Button
            onClick={openReviewModal}
            className={`w-[11.9rem] h-[3.3rem] text-[1.5rem] ${isBlinking ? 'blinking' : ''}`}
            size="small"
            variant="outline"
          >
            리뷰 작성하기
          </Button>
          <div
            onMouseEnter={handleStarHover}
            onMouseLeave={handleStarLeave}
            className="cursor-pointer"
            onClick={openReviewModal}
          >
            <Image src="/icons/review.svg" alt="review_button" width={176.99} height={68} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 h-[71.2rem] mt-[2.9rem] px-[5.8rem]">
        {/* 프로필 */}
        <div className="flex flex-col gap-[9.9rem] border-r">
          <div className="mt-[5.5rem] flex flex-col items-center">
            <div className="w-[19.8rem] h-[19.8rem] bg-gray rounded-[100rem]"></div>
            <div className="mt-[2rem]">
              <p className="text-[5rem] font-bold italic">wassup!</p>
              <div className="flex gap-[1rem]">
                <p className="text-[5rem] font-bold">
                  <span className="underline">{userData?.name}</span> 님
                </p>
                <button>
                  <Image
                    src="/icons/setting.svg"
                    alt=""
                    width={24}
                    height={24}
                    onClick={() => router.push('/myInfo')}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-[2.7rem] mt-[5rem]">
              <Button
                className="w-[20.9rem] h-[6rem] border border-black font-bold text-[1.8rem]"
                size="small"
                variant="green"
                onClick={() => router.push('/workRequest')}
              >
                작업 요청하기
              </Button>

              <Button
                className="w-[20.9rem] h-[6rem] border border-black font-bold text-[1.8rem] flex justify-center items-center gap-[1.7rem]"
                size="small"
                variant="outline"
                onClick={goToTrelloLink}
              >
                Workspace
                <Image src="/icons/workSpace.svg" alt="" width={24} height={24} />
              </Button>
            </div>
            <TextButton href="/howToRequest" className="mt-[4rem] text-[1.5rem]">
              <span className="font-bold">how to request</span>
            </TextButton>
          </div>
          <div>
            <button className="font-bold text-[1.5rem] text-[#878787]">logout</button>
          </div>
        </div>

        {/* 구독현황 */}
        <div className="flex flex-col pl-[5.9rem] justify-center">
          <div className="flex justify-between mt-[0.9rem]">
            <p className="font-bold">Status</p>
            <button
              className="font-bold underline"
              onClick={() => setSubscriptionStatusModal(true)}
            >
              구독현황 변경 및 결제이력
            </button>
          </div>
          {handleStatus()}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
