import bgImage from '@/assets/images/main-bg.png';
import { Body, Title } from '@/components/typography';
import logo from '@/assets/images/start-logo.png';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { GlobalLoader } from '@/components';
import welcomeVideoThumbnail from '@/assets/images/welcome-1-thumb.jpg';
import { useSendPulseTag } from '@/hooks/useSendPulse';

import './StartPage.scss';
import { getAuthTelegram } from '@/api/auth.ts';
import { preloadImages } from '@/utils/preloadImages';

const StartPage = () => {
  const navigate = useNavigate();
  const { sendTag } = useSendPulseTag();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const animationIntervalRef = useRef<number | null>(null);

  const handleJoinClick = async () => {
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

    const assetsToPreload = [bgImage, welcomeVideoThumbnail];

    const apiCall = getAuthTelegram(localStorage.getItem('user_id') || '');
    const preloadCall = preloadImages(assetsToPreload);

    let apiResult;
    let apiError = null;

    try {
      apiResult = await apiCall;
    } catch (error) {
      apiError = error;
      console.error('Помилка API під час перевірки реєстрації:', error);
    }
    await preloadCall;
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    setLoadingProgress(100);

    let destination: string;
    if (!apiError && apiResult?.data?.user?.registration) {
      sessionStorage.setItem('access_token', apiResult.data.tokens.accessToken);
      sessionStorage.setItem(
        'refresh_token',
        apiResult.data.tokens.refreshToken
      );
      localStorage.setItem(
        'contact_id',
        apiResult?.data?.user?.contactId || ''
      );
      localStorage.setItem('isRegister', 'true');

      const contactId = apiResult.data.user.contactId;
      if (contactId) {
        try {
          await sendTag(contactId, ['regdone']);
        } catch (tagError) {
          console.error(
            "Помилка відправки тегу 'regdone' зі StartPage:",
            tagError
          );
        }
      }

      destination = '/';
    }
    // if (!apiError && apiResult?.data?.user?.registration) {
    //   localStorage.setItem('isRegister', 'true');
    //   destination = '/';
    // }
    else if (!apiError) {
      localStorage.removeItem('isRegister');
      destination = '/welcome-first';
    } else {
      if (localStorage.getItem('isRegister')) {
        destination = '/';
      } else {
        destination = '/welcome-first';
      }
    }

    setTimeout(() => {
      navigate({ to: destination });
    }, 100);
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
      <div className="px-4 min-h-screen main-block">
        <div></div>
        <div className="container">
          <div className="flex justify-center mb-8">
            <img src={logo} className="w-70 h-70"></img>
          </div>
          <Title
            variant="display"
            className="text-[#181717] mb-2 text-fade-mask main-title"
          >
            TRADE UNIVERSITY
          </Title>
          <Body variant="mdMedium" className="text-light mb-8">
            Начни свой путь в трейдинге с поддержкой команды. Обучение,
            сообщество и реальные результаты - всё в одном месте.
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
