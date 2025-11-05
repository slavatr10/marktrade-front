import { useEffect } from 'react';
import bgImage from '@/assets/images/main-bg.png';
import { useSendPulseTag } from '@/hooks/useSendPulse';
import { useNavigate } from '@tanstack/react-router';

import IntroLayout from '@/components/introLayout/introLayout.tsx';
import { IntroductionContent } from '@/components';

// import './WelcomeSecondPage.scss';

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
          await fetch(postbackUrl, { method: 'GET', mode: 'no-cors' });
          console.log("Chatterfy 'vstyp2' postback відправлено успішно (одноразово).");
        } catch (error) {
          console.error("Помилка при відправці Chatterfy 'vstyp2' postback:", error);
        }
      } else {
        console.warn("Click ID не знайдено в localStorage. Chatterfy 'vstyp2' postback не відправлено.");
      }
    };

    // -------------------------------------------
    // ВІДПРАВКА ТЕГУ "vstyp2" В SENDPULSE
    // -------------------------------------------
    const sendSendPulseTag = async () => {
      if (contactId) {
        try {
          await sendTag(contactId, ['vstyp2']);
          console.log("SendPulse тег 'vstyp2' відправлено успішно (одноразово) для contactId:", contactId);
        } catch (error) {
          console.error("Помилка при відправці SendPulse тегу 'vstyp2':", error);
        }
      } else {
        console.warn("Contact ID не знайдено в localStorage. SendPulse тег 'vstyp2' не відправлено.");
      }
    };

    sendChatterfyPostback();
    sendSendPulseTag();
  }, [sendTag]);

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
          description="В этом уроке ты узнаешь, как устроено сообщество Trade University. Мы расскажем, из чего состоит система — обучение, сигналы и поддержка — и как всё это помогает тебе расти шаг за шагом вместе с командой."
          videoSrc="https://vz-774045bd-680.b-cdn.net/76894c8b-5722-4dcc-88f3-d54529cd34cf/playlist.m3u8"
          thumbnail="https://vz-774045bd-680.b-cdn.net/76894c8b-5722-4dcc-88f3-d54529cd34cf/thumbnail_95062995.jpg"
          isActive={true}
          index={0}
          totalItems={2}
          onNext={() => navigate({ to: '/registration' })}
          showNextButton={true}
        />
      </IntroLayout>
    </div>
  );
};

export default WelcomeSecondPage;
