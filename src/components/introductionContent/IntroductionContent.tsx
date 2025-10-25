import { Button, VideoPlayer } from '@/components';
import { Body, Title } from '../typography';

import './introductionContent.scss';

interface IntroductionContentProps {
  title: string;
  description: string;
  videoSrc: string;
  thumbnail?: string;
  headerIcon: string;
  isActive: boolean;
  isRegister?: boolean;
  onRegisterCheck?: () => void;

  index: number;
  totalItems: number;
  onNext: (currentIndex: number) => void;
}

//const SENDPULSE_EVENT_FLAG = 'sp_event_bb7cbbea9d544af3e93c2ad9c6eb366a_sent';

export const IntroductionContent = ({
  title,
  description,
  videoSrc,
  thumbnail,
  isActive,
  isRegister,
  onRegisterCheck,

  index,
  totalItems,
  onNext,
}: IntroductionContentProps) => {
  const handleRegisterClick = () => {
    // Базова URL-адреса
    let url =
      'https://u3.shortink.io/register?utm_campaign=802555&utm_source=affiliate&utm_medium=sr&a=jy9IGDHoNUussf&ac=bot-protrd&code=YRL936';

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
    <div className={`w-full flex flex-col rounded-[20px] px-4`}>
      {isActive && (
        <div className={`w-full rounded-2xl ${isRegister && 'mb-4'} video-player`}>
          <VideoPlayer src={videoSrc} thumbnail={thumbnail} />
        </div>
      )}
      <div className="flex gap-1 items-center mb-[8px]">
        <Title className="text-[#181717] sub-title-text">
          {title}
        </Title>
      </div>
      <Body
        className={`text-[#323030] description-text ${
          isRegister ? 'description-text--register' : ''
        }`}
      >
        {description}
      </Body>

      {isActive && !isRegister && index < totalItems - 1 && (
        <div className="mt-4">
          <Button
            title="Следующий урок"
            onClick={() => onNext(index)}
            className="w-full"
            isGreen
          />
        </div>
      )}

      {isRegister && isActive && (
        <div className="flex w-full justify-between flex-col items-center gap-3">
          <Button
            title="Регистрация"
            onClick={handleRegisterClick}
            isGreen
            className="w-full"
          />
          <Button
            title="Проверить регистрацию"
            onClick={onRegisterCheck || (() => {})}
            className="w-full"
            styledClassName="!text-[#181717]"
          />
        </div>
      )}
    </div>
  );
};
