import { useState } from 'react';
import { getAuthTelegram } from '@/api/auth';
import { Button, LinkComponent, SuccessPage, VideoPlayer } from '@/components';
import { useDepositTracking } from '@/hooks';
import bgImage from '@/assets/images/main-bg.png';
import { Body, Title } from '@/components/typography';
import { ArrowLeft } from '@/assets/icons';
import { useNavigate } from '@tanstack/react-router';

const DepositPage = () => {
  useDepositTracking();

  const [loadingCheckDeposit, setLoadingCheckDeposit] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('user_id') || '';
  // const search = useSearch({ from: '/deposit' });

  const handleVerifyDeposit = async () => {
    setLoadingCheckDeposit(true);
    try {
      const isDepositSuccess = await getAuthTelegram(userId);
      if (isDepositSuccess?.data?.user?.deposit) {
        localStorage.setItem('deposit', 'true');
        setDepositSuccess(true);
      } else {
        setDepositSuccess(false);
      }
    } catch (error) {
      console.error('Ошибка проверки депозита:', error);
      setDepositSuccess(false);
    } finally {
      setButtonClicked(true);
      setLoadingCheckDeposit(false);
    }
  };

  if (buttonClicked) {
    return (
      <SuccessPage
        type={depositSuccess ? 'success' : 'failure'}
        text={depositSuccess ? 'Депозит успешен!' : 'Депозит не подтвержден'}
        linkUrl={`/lesson?id=f85c93ed-aca4-43d5-a021-d05bbe7a6a2d&lessonNumber="1"&course_id=8bc653d6-30fe-4f2a-b636-285a882c744d&category_id=3879601c-6999-4a8b-9dc6-c5e892a61f33&exercise_id=3117a43a-e4a7-4f1f-b463-3c4d128c55ea&exercisesQuantity="6"&testNumber="1"`}
        linkText={depositSuccess ? 'Продолжить' : 'Попробовать еще раз'}
        setButtonClicked={setButtonClicked}
      />
    );
  }

  const buildDepositUrl = () => {
    const cid = localStorage.getItem('click_id') || '';
    const base =
      'https://u3.shortink.io/register?utm_campaign=830101&utm_source=affiliate&utm_medium=sr&a=6FAzs5MiTwk2Cf&ac=mark-trade&code=ZFV117';
    return cid ? `${base}&click_id=${encodeURIComponent(cid)}` : base;
  };

  return (
    <div
      className="flex flex-col justify-between min-h-screen p-4 bg-neutral-950 rounded shadow-md pt-24 pb-24"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* <IntroductionHeader type="text" title="" /> */}
      <button
        onClick={() => {
          navigate({ to: '/' });
        }}
        className="absolute left-4 top-[104px]"
      >
        <ArrowLeft svgColor="black" width={18} height={18} />
      </button>
      <Title variant="h1" className="mb-6 text-[#181717] text-center">
        Депозит на платформе
      </Title>
      <div>
        <div className={`w-full rounded-2xl mb-8`}>
          <VideoPlayer
            src={
              'https://vz-774045bd-680.b-cdn.net/70212ec7-574a-49b7-8a10-cc7bc606f043/playlist.m3u8'
            }
            thumbnail={'https://vz-774045bd-680.b-cdn.net/c43f0684-dddd-4b58-98be-e0e7767005bc/thumbnail_da032d7c.jpg'}
          />
        </div>
        <div className="flex flex-col gap-6 mb-10">
          <Body variant="mdRegular" className="text-[#323030]">
            Ты уже сделал главное - решил разобраться в трейдинге. Теперь важно
            перейти к практике. Пополни счёт на платформе, созданный по моей
            ссылке - это подтвердит, что ты в команде, и откроет доступ ко всем
            инструментам
          </Body>
        </div>
      </div>
      <div>
        <LinkComponent
          to={buildDepositUrl()}
          target="_blank"
          className="w-full mb-3"
        >
          <Title variant="h6">Сделать депозит</Title>
        </LinkComponent>

        <Button
          className="w-full"
          onClick={handleVerifyDeposit}
          title="Проверить"
          isLoading={loadingCheckDeposit}
          styledClassName="!text-[#181717]"
        />
      </div>
    </div>
  );
};

export default DepositPage;
