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
      className=""
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full main-block min-h-screen">
        <div className="relative flex items-center w-full mb-8">
          {' '}
          <button
            onClick={() => {
              navigate({ to: '/welcome-first' });
            }}
            className="absolute left-4"
          >
            <ArrowLeft svgColor="#797979" />
          </button>
          <Title variant="h2" className="flex-1 text-center title">
            Знакомство с платформой
          </Title>
        </div>

        <IntroductionContent
          title="Наша команда и система обучения"
          description="В этом уроке ты узнаешь, как устроено сообщество Trade University. Мы расскажем, из чего состоит система - обучение, сигналы и поддержка - и как всё это помогает тебе расти шаг за шагом вместе с командой."
          videoSrc="https://vz-3325699a-726.b-cdn.net/ddd7c6f7-b637-420f-9a7a-a675dea76a81/playlist.m3u8"
          thumbnail="https://vz-774045bd-680.b-cdn.net/76894c8b-5722-4dcc-88f3-d54529cd34cf/thumbnail_95062995.jpg"
          headerIcon={switchIcon}
          isActive={true}
          index={0}
          totalItems={0}
          onNext={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
        <div className="px-4">
          <LinkComponent to="/registration" className="link-next w-full">
            <Title variant="h3">Следующий урок</Title>
          </LinkComponent>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSecondPage;
