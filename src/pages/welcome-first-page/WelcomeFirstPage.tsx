import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import IntroLayout from '@/components/introLayout/introLayout.tsx';
import { GlobalLoader, IntroductionContent } from '@/components';
import { useWelcomeTracking } from '@/hooks';
import bgImage from '@/assets/images/main-bg.png';
import welcomeThumbnail from '@/assets/images/welcome-1-thumb.jpg';
import welcomeThumbnailNext from '@/assets/images/welcome-2-thumb.jpg';
import { preloadImages } from '@/utils/preloadImages';
import './WelcomeFirstPage.scss';

const WelcomeFirstPage = () => {
  useWelcomeTracking({
    chatterfyEvent: 'vstyp1',
    sendPulseTag: 'vstyp1',
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const animationIntervalRef = useRef<number | null>(null);

  const handleNextPageClick = async () => {
    setIsLoading(true);
    setLoadingProgress(0);

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    animationIntervalRef.current = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 90) {
          return prev + 5;
        } else {
          if (animationIntervalRef.current)
            clearInterval(animationIntervalRef.current);
          return 90;
        }
      });
    }, 50);

    await preloadImages([welcomeThumbnailNext]);

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    setLoadingProgress(100);

    setTimeout(() => {
      navigate({ to: '/welcome-second' });
    }, 100);
  };

  if (isLoading) {
    return <GlobalLoader progress={loadingProgress} />;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <IntroLayout title="Знакомство с платформой" backTo="/start">
        <IntroductionContent
          title="Что такое трейдинг: просто о главном"
          description="Узнай, как работает финансовый рынок и почему трейдинг - это не азарт, а система. Мы разберём, кто такие трейдеры, как они зарабатывают на движении цен и почему каждый человек может освоить этот навык."
          videoSrc="https://vz-774045bd-680.b-cdn.net/f4189520-fabc-465b-813f-4c090cf92998/playlist.m3u8"
          thumbnail={welcomeThumbnail}
          isActive={true}
          index={0}
          totalItems={2}
          onNext={handleNextPageClick}
          showNextButton={true}
        />
      </IntroLayout>
    </div>
  );
};

export default WelcomeFirstPage;
