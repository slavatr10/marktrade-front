import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import bgImage from '@/assets/images/main-bg.png';
import { useWelcomeTracking } from '@/hooks';
import IntroLayout from '@/components/introLayout/introLayout.tsx';
import { GlobalLoader, IntroductionContent } from '@/components';
import welcomeThumbnail from '@/assets/images/welcome-2-thumb.jpg';
import welcomeThumbnailNext from '@/assets/images/welcome-3-thumb.jpg';
import { preloadImages } from '@/utils/preloadImages';

const WelcomeSecondPage = () => {
  useWelcomeTracking({
    chatterfyEvent: 'vstyp2',
    sendPulseTag: 'vstyp2',
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const animationIntervalRef = useRef<number | null>(null);

  const handleNextClick = async () => {
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
      navigate({ to: '/registration' });
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
      <IntroLayout title="Знакомство с платформой" backTo="/welcome-first">
        <IntroductionContent
          title="Наша команда и система обучения"
          description="В этом уроке ты узнаешь, как устроено сообщество Trade University. Мы расскажем, из чего состоит система - обучение, сигналы и поддержка - и как всё это помогает тебе расти шаг за шагом вместе с командой."
          videoSrc="https://vz-774045bd-680.b-cdn.net/76894c8b-5722-4dcc-88f3-d54529cd34cf/playlist.m3u8"
          thumbnail={welcomeThumbnail}
          isActive={true}
          index={0} // Цей індекс, можливо, варто змінити на 1, оскільки це другий крок
          totalItems={2}
          onNext={handleNextClick}
          showNextButton={true}
        />
      </IntroLayout>
    </div>
  );
};

export default WelcomeSecondPage;
