import bgImage from '@/assets/images/main-bg.png';
import { Body, Title } from '@/components/typography';
import logo from '@/assets/images/start-logo.png';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { GlobalLoader } from '@/components';

import './StartPage.scss';

const StartPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const animationIntervalRef = useRef<number | null>(null);
  const handleJoinClick = () => {
    if (localStorage.getItem('isRegister')) {
      navigate({ to: '/' });
    } else {
      navigate({ to: '/welcome-first' });
    }
  };

  useEffect(() => {
    const logoImg = new Image();
    const backgroundImg = new Image();
    let logoLoaded = false;
    let backgroundLoaded = false;

    const loadingComplete = () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      setLoadingProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    };

    // Плавна анімація до 99%
    animationIntervalRef.current = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 99) {
          return prev + 1;
        } else {
          if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
          }
          return prev;
        }
      });
    }, 20);

    const checkImagesLoaded = () => {
      if (logoLoaded && backgroundLoaded) {
        loadingComplete();
      }
    };

    logoImg.onload = () => {
      logoLoaded = true;
      checkImagesLoaded();
    };
    logoImg.src = logo;

    backgroundImg.onload = () => {
      backgroundLoaded = true;
      checkImagesLoaded();
    };
    backgroundImg.src = bgImage;

    logoImg.onerror = backgroundImg.onerror = () => {
      console.error('Помилка завантаження зображення для StartPage');
      loadingComplete();
    };

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return <GlobalLoader progress={loadingProgress} />;
  }

  return (
    <div
      className="w-full"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="px-4 main-block">
        <div></div>
        <div className="container">
          <div className="flex justify-center mb-8">
            <img src={logo} className="w-70 h-70"></img>
          </div>
          <Title variant="display" className="text-[#181717] mb-2 text-fade-mask main-title">
            TRADE UNIVERSITY
          </Title>
          <Body variant="mdMedium" className="text-light mb-8">
            Начни свой путь в трейдинге с поддержкой команды. Обучение, сообщество
            и реальные результаты — всё в одном месте.
          </Body>
        </div>
        <button
          className="no-underline flex items-center justify-center text-white rounded-[36px] transition-colors duration-300 h-[48px] bg-cerulean-800 w-full"
          onClick={handleJoinClick}
        >
          <Title variant="h6">Присоединиться</Title>
        </button>
      </div>
    </div>
  );
};

export default StartPage;
