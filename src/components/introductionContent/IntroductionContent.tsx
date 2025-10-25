import { Button, VideoPlayer } from '@/components';
import { Body, Title } from '../typography';
interface IntroductionContentProps {
  title: string;
  description: string;
  videoSrc: string;
  thumbnail?: string;
  headerIcon: string;
  isActive: boolean;
  isRegister?: boolean;
  onRegisterCheck?: () => void;
}

//const SENDPULSE_EVENT_FLAG = 'sp_event_bb7cbbea9d544af3e93c2ad9c6eb366a_sent';

export const IntroductionContent = ({
  title,
  description,
  videoSrc,
  thumbnail,
  headerIcon,
  isActive,
  isRegister,
  onRegisterCheck,
}: IntroductionContentProps) => {
  // const clickId = localStorage.getItem('click_id');
  // const handleRegisterClick = () => {
  //   if (clickId) {
  //     const url = `https://u3.shortink.io/register?utm_campaign=802555&utm_source=affiliate&utm_medium=sr&a=jy9IGDHoNUussf&ac=bot-protrd&code=YRL936&click_id=${clickId}`;
  //     if (window.Telegram?.WebApp) {
  //       window.Telegram.WebApp.openLink(url);
  //     } else {
  //       window.location.href = url;
  //     }
  //   } else {
  //     console.error('Click ID not found in localStorage');
  //   }
  // };
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
    <div
      className={`w-full flex flex-col ${
        isActive && 'bg-white'
      } rounded-[20px] p-4 mb-9`}
    >
      <div className="flex gap-1 items-center mb-[14px]">
        <img src={headerIcon} alt="icon" className="w-9 h-9"></img>
        <Title variant="h2" className="text-[#181717]">
          {title}
        </Title>
      </div>
      <Body
        variant="mdRegular"
        className={`text-[#323030] ${isActive && 'mb-4'}`}
      >
        {description}
      </Body>
      {isActive && (
        <div className={`w-full rounded-2xl ${isRegister && 'mb-4'}`}>
          <VideoPlayer src={videoSrc} thumbnail={thumbnail} />
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
