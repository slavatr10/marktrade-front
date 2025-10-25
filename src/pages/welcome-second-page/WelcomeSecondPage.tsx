import { useEffect } from 'react';
import { IntroductionContent, LinkComponent } from '@/components';
import { useSendPulseTag } from '@/hooks/useSendPulse';
import bgImage from '@/assets/images/main-bg.png';
import { Title } from '@/components/typography';
import switchIcon from '@/assets/images/switch-icon.png';
import { ArrowLeft } from '@/assets/icons';
import { useNavigate } from '@tanstack/react-router';

const WelcomeSecondPage = () => {
  const { sendTag } = useSendPulseTag();
  const navigate = useNavigate();

  useEffect(() => {
    const storedClickId = localStorage.getItem('click_id');
    const contactId = localStorage.getItem('contact_id');

    // -------------------------------------------
    // ВІДПРАВКА ЗАПИТУ НА ТРЕКЕР CHATTERFY (vstyp2)
    // -------------------------------------------
    const sendChatterfyPostback = async () => {
      if (storedClickId) {
        const postbackUrl = `https://api.chatterfy.ai/api/postbacks/8dd8f7ba-3f29-4da8-9db4-3f04bf067c5e/tracker-postback?tracker.event=vstyp2&clickid=${storedClickId}`;
        try {
          await fetch(postbackUrl, {
            method: 'GET',
            mode: 'no-cors',
          });
          console.log(
            "Chatterfy 'vstyp2' postback відправлено успішно (одноразово)."
          );
        } catch (error) {
          console.error(
            "Помилка при відправці Chatterfy 'vstyp2' postback:",
            error
          );
        }
      } else {
        console.warn(
          "Click ID не знайдено в localStorage. Chatterfy 'vstyp2' postback не відправлено."
        );
      }
    };

    // -------------------------------------------
    // ВІДПРАВКА ТЕГУ "vstyp2" В SENDPULSE
    // -------------------------------------------
    const sendSendPulseTag = async () => {
      if (contactId) {
        try {
          await sendTag(contactId, ['vstyp2']);
          console.log(
            "SendPulse тег 'vstyp2' відправлено успішно (одноразово) для contactId:",
            contactId
          );
        } catch (error) {
          console.error(
            "Помилка при відправці SendPulse тегу 'vstyp2':",
            error
          );
        }
      } else {
        console.warn(
          "Contact ID не знайдено в localStorage. SendPulse тег 'vstyp2' не відправлено."
        );
      }
    };

    // Запускаємо обидві функції при монтуванні компонента
    sendChatterfyPostback();
    sendSendPulseTag();
  }, []); // <--- ЗМІНЕНО: Пустий масив залежностей, щоб ефект запускався лише один раз
  //  при першому рендері (монтуванні компонента).

  return (
    <div
      className="flex min-h-screen w-full flex-col justify-between bg-natural-950     pt-[calc(6.8rem+var(--safe-top))]  "
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="">
        <div className="relative flex items-center w-full mb-8">
          {' '}
          <button
            onClick={() => {
              navigate({ to: '/welcome-first' });
            }}
            className="absolute left-4"
          >
            <ArrowLeft svgColor="black" />
          </button>
          <Title variant="h2" className="text-[#181717] flex-1 text-center">
            Знакомство с платформой
          </Title>
        </div>

        <IntroductionContent
          title="Наша команда и система обучения"
          description="Мы расскажем, почему наша методика работает, как построено обучение, и за счёт чего результаты приходят быстро и без перегрузки. Ты узнаешь, чем наша команда отличается от других: ежедневная поддержка, пошаговая стратегия и реальная торговая практика под руководством наставников. После этого урока у тебя появится уверенность, что ты не один — за твоей спиной будет команда, которая поможет на каждом этапе."
          videoSrc="https://vz-3325699a-726.b-cdn.net/ddd7c6f7-b637-420f-9a7a-a675dea76a81/playlist.m3u8"
          thumbnail="https://spro-trade.b-cdn.net/EDU3/v2.jpg"
          headerIcon={switchIcon}
          isActive={true}
          index={0}
          totalItems={0}
          onNext={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </div>
      <div className="px-4 pb-[calc(2rem+var(--safe-bottom))]">
        <LinkComponent to="/registration" className="link-next w-full mb-5">
          <Title variant="h3">Следующий урок</Title>
        </LinkComponent>
      </div>
    </div>
  );
};

export default WelcomeSecondPage;
