// src/components/success/SuccessPage.tsx
import React, { useEffect, useState } from 'react';
import { LinkComponent, ConfettiAnimation, GlobalLoader } from '@/components';
import successIcon from '@/assets/images/success.png';
import failureIcon from '@/assets/images/failure.png';
import bgImage from '@/assets/images/main-bg.png';
import { Body, Title } from '../typography';
import { CrossIcon } from '@/assets/icons';
import { useNavigate } from '@tanstack/react-router';
import { getCourses } from '@/api/course';

interface SuccessPageProps {
  text: string;
  rightAnswers?: number;
  questions?: number;
  linkUrl: string;
  linkText: string;
  setButtonClicked?: (value: boolean) => void;
  isRegistration?: boolean;
  helperText?: string;
  successThreshold?: number;
  type?: 'success' | 'failure' | 'noAccess';
  exerciseId?: string;
  courseId?: string;
  categoryId?: string;
  testNumber?: number;
  onClose?: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  text,
  rightAnswers = 0,
  questions = 0,
  linkUrl,
  linkText,
  setButtonClicked,
  isRegistration = true,
  helperText,
  successThreshold = 0.6,
  type = 'success',
  exerciseId,
  courseId,
  categoryId,
  testNumber,
  onClose,
}) => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const [isAssetLoading, setIsAssetLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const scorePercentage = questions > 0 ? rightAnswers / questions : 0;
  const isTestSuccess = !isRegistration && scorePercentage >= successThreshold;

  const icons = {
    success: successIcon,
    failure: failureIcon,
    noAccess: failureIcon,
  };

  useEffect(() => {
    const assetsToLoad = [bgImage, successIcon, failureIcon];

    const totalAssets = assetsToLoad.length;
    if (totalAssets === 0) {
      setIsAssetLoading(false);
      setLoadingProgress(100);
      return;
    }

    let loadedCount = 0;

    const itemLoaded = (assetName: string) => {
      console.log(`Asset loaded: ${assetName}`);
      loadedCount++;
      const progress = Math.round((loadedCount / totalAssets) * 100);
      setLoadingProgress(progress);

      if (loadedCount === totalAssets) {
        setIsAssetLoading(false);
      }
    };

    assetsToLoad.forEach((assetSrc, index) => {
      const img = new Image();
      img.onload = () => itemLoaded(`Asset ${index + 1}`);
      img.onerror = () => {
        console.error(`Failed to load asset: ${assetSrc}`);
        itemLoaded(`Asset ${index + 1} (error)`);
      };
      img.src = assetSrc as string;
    });
  }, []);

  const getDisplayType = (): 'success' | 'failure' | 'noAccess' => {
    if (type) return type;
    if (text === 'Ошибка регистрации') return 'failure';
    if (!isRegistration && questions > 0)
      return scorePercentage >= successThreshold ? 'success' : 'failure';
    return 'success';
  };

  const restartTestUrl = exerciseId
    ? `/test?exercise_id=${exerciseId}&question=1&course_id=${courseId}&categoryId=${categoryId}&testNumber=${testNumber}`
    : linkUrl;

  const displayType = getDisplayType();
  const showConfetti = displayType === 'success' && isTestSuccess;

  /**
   * 🔄 Перенаправлення на головну:
   * Якщо `linkUrl === '/'`, то:
   *   1. Робимо getCourses(), щоб оновити backend/courses.
   *   2. Потім робимо повне перезавантаження сторінки (window.location.replace('/')).
   */
  const goHomeWithRefresh = async (): Promise<void> => {
    if (busy) return;
    setBusy(true);
    try {
      if (setButtonClicked) setButtonClicked(false);

      if (linkUrl === '/' || linkUrl.startsWith('/?')) {
        try {
          await getCourses();
        } catch (e) {
          console.error('getCourses() failed before navigating home:', e);
        }

        sessionStorage.setItem('mt_force_home_refresh_ts', String(Date.now()));
        window.location.replace(`/${Date.now()}`); // cache-buster
        return;
      }

      navigate({ to: linkUrl });
    } finally {
      setBusy(false);
    }
  };
  if (isAssetLoading) {
    return <GlobalLoader progress={loadingProgress} />;
  }
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {showConfetti && <ConfettiAnimation duration={5000} particleCount={60} />}

      <div className="flex flex-col items-center min-h-screen p-4 w-full">
        {/* X Button */}
        <div className="absolute right-5 top-[calc(9.1rem+var(--safe-top))]">
          <button
            className="cursor-pointer"
            // onClick={() => void goHomeWithRefresh()}
            onClick={() => {
              if (linkUrl === '/registration') {
                if (onClose) {
                  onClose();
                  return;
                }
                if (setButtonClicked) setButtonClicked(false);
                return;
              }
              void goHomeWithRefresh();
            }}
            disabled={busy}
          >
            <CrossIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center flex-1">
          <img
            src={icons[displayType]}
            alt={displayType}
            className="w-40 mb-5"
          />

          <Title variant="h1" className="text-[#181717] mb-2">
            {text}
          </Title>

          {!isRegistration && rightAnswers >= 0 && (
            <>
              <Body variant="lgRegular" className="text-light">
                Ваш результат:
              </Body>
              <Title variant="h9" className="text-[#0049C7]">
                {rightAnswers}/{questions}
              </Title>
            </>
          )}

          {helperText && (
            <Body className="text-center text-black">{helperText}</Body>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col justify-center mb-[40px] w-full ">
          {displayType === 'noAccess' && (
            <LinkComponent
              to={linkUrl}
              className={`w-full ${
                busy ? 'pointer-events-none opacity-70' : ''
              }`}
              variant="primary"
              onClick={() => void goHomeWithRefresh()}
            >
              {linkText}
            </LinkComponent>
          )}

          {displayType === 'success' && (
            <>
              <LinkComponent
                to={linkUrl}
                className={`w-full mb-3 ${
                  busy ? 'pointer-events-none opacity-70' : ''
                }`}
                onClick={() => void goHomeWithRefresh()}
              >
                <Title variant="h6">{linkText}</Title>
              </LinkComponent>

              {!isRegistration && rightAnswers >= 0 && (
                <LinkComponent
                  to={restartTestUrl}
                  variant="secondary"
                  className="w-full bg-[#D1D5DB]"
                  onClick={() => {
                    if (setButtonClicked) setButtonClicked(false);
                  }}
                >
                  <Title variant="h6" className="text-[#181717]">
                    Попробовать снова
                  </Title>
                </LinkComponent>
              )}
            </>
          )}

          {displayType === 'failure' && (
            <>
              <LinkComponent
                to={linkUrl}
                className={`w-full mb-2 ${
                  busy ? 'pointer-events-none opacity-70' : ''
                }`}
                onClick={() => {
                  if (linkUrl === '/registration') {
                    if (onClose) {
                      onClose();
                      return;
                    }
                    if (setButtonClicked) setButtonClicked(false);
                    return;
                  }
                  void goHomeWithRefresh();
                }}
              >
                <Title variant="h6">{linkText}</Title>
              </LinkComponent>

              <LinkComponent
                to="https://t.me/mark_TU7"
                className="w-full z-20"
                variant="secondary"
                onClick={() => {
                  if (setButtonClicked) setButtonClicked(false);
                }}
              >
                <Title variant="h6" className="text-[#181717]">
                  Написать
                </Title>
              </LinkComponent>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
