import { Button, VideoPlayer } from '@/components';
import { Body, Title } from '@/components/typography';
import './introductionContent.scss';

interface IntroductionContentProps {
  title: string;
  description: string;
  videoSrc: string;
  thumbnail?: string;
  headerIcon?: string;
  isActive: boolean;
  isRegister?: boolean;
  onRegisterCheck?: () => void;

  index: number;
  totalItems: number;
  onNext: (currentIndex: number) => void;

  /** якщо треба вимкнути внутрішню кнопку «Следующий урок» */
  showNextButton?: boolean;
}

export const IntroductionContent = ({
                                      title,
                                      description,
                                      videoSrc,
                                      thumbnail,
                                      headerIcon,
                                      isActive,
                                      isRegister,
                                      onRegisterCheck,
                                      index,
                                      totalItems,
                                      onNext,
                                      showNextButton = true,
                                    }: IntroductionContentProps) => {
  const handleRegisterClick = () => {
    // Базова URL-адреса
    let url =
      'https://u3.shortink.io/register?utm_campaign=830101&utm_source=affiliate&utm_medium=sr&a=6FAzs5MiTwk2Cf&ac=mark-trade&code=ZFV117';

    // Отримуємо click_id з localStorage
    const clickId = localStorage.getItem('click_id');

    // Якщо click_id існує, додаємо його до посилання
    if (clickId) {
      url += `&click_id=${clickId}`;
    }

    // Відкриваємо посилання
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.location.href = url;
    }
  };

  return (
    // ⚠️ без внутрішніх px-4 — сітку дає IntroLayout
    <div className="w-full flex flex-col rounded-[20px]">
      <div className="flex gap-1 items-center mb-[8px]">
        {headerIcon ? <img src={headerIcon} alt="" width={20} height={20} /> : null}
        <Title className="text-[#181717] sub-title-text">
          {title}
        </Title>
      </div>

      <Body className="text-[#323030] description-text">
        {description}
      </Body>

      {isActive && (
        <div
          className={`w-full rounded-2xl ${isRegister ? 'mb-4' : ''} video-player ${
            isRegister ? 'player--register' : ''
          }`}
        >
          <VideoPlayer src={videoSrc} thumbnail={thumbnail} />
        </div>
      )}

      {/* Кнопка «Следующий урок» — тільки якщо не режим регистрации і є наступний урок */}
      {showNextButton && isActive && !isRegister && index < totalItems - 1 && (
        <div className="mt-4">
          <Button
            title="Следующий урок"
            onClick={() => onNext(index)}
            className="w-full"
            isGreen
          />
        </div>
      )}

      {/* Режим реєстрації: 2 кнопки, з вирівняними відступами */}
      {isRegister && isActive && (
        <div className="flex w-full flex-col items-center">
          {/* 1) Перша кнопка — на одному рівні, як на інших сторінках */}
          <div className="w-full mt-4">
            <Button
              title="Регистрация"
              onClick={handleRegisterClick}
              isGreen
              className="w-full"
            />
          </div>

          {/* 2) Друга кнопка — нижче, з додатковим простором внизу */}
          <div className="w-full mt-3 mb-6">
            <Button
              title="Проверить регистрацию"
              onClick={onRegisterCheck || (() => {})}
              className="w-full"
              styledClassName="!text-[#181717]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
