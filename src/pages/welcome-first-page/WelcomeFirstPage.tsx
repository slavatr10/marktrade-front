import { useEffect } from 'react';
import {
  IntroductionContent,
  LinkComponent,
} from '@/components';
import { useSendPulseTag } from '@/hooks/useSendPulse';
import bgImage from '@/assets/images/main-bg.png';
import { Title } from '@/components/typography';
import wayIcon from '@/assets/images/way-icon.png';

const SENDPULSE_EVENT_FLAG = 'sp_event_4edc2ef573b946fdefa7ada4749fee0c_sent';

const WelcomeFirstPage = () => {
  const { sendTag } = useSendPulseTag();

  useEffect(() => {
    const storedClickId = localStorage.getItem('click_id');
    const contactId = localStorage.getItem('contact_id');

    // -------------------------------------------
    // ВІДПРАВКА ЗАПИТУ НА ТРЕКЕР CHATTERFY (vstyp1)
    // -------------------------------------------
    const sendChatterfyPostback = async () => {
      if (storedClickId) {
        const postbackUrl = `https://api.chatterfy.ai/api/postbacks/8dd8f7ba-3f29-4da8-9db4-3f04bf067c5e/tracker-postback?tracker.event=vstyp1&clickid=${storedClickId}`;
        try {
          await fetch(postbackUrl, {
            method: 'GET',
            mode: 'no-cors',
          });
          console.log(
            "Chatterfy 'vstyp1' postback відправлено успішно (одноразово)."
          );
        } catch (error) {
          console.error(
            "Помилка при відправці Chatterfy 'vstyp1' postback:",
            error
          );
        }
      } else {
        console.warn(
          "Click ID не знайдено в localStorage. Chatterfy 'vstyp1' postback не відправлено."
        );
      }
    };

    // -------------------------------------------
    // ВІДПРАВКА ТЕГУ "vstyp1" В SENDPULSE
    // -------------------------------------------
    const sendSendPulseTag = async () => {
      if (contactId) {
        try {
          await sendTag(contactId, ['vstyp1']);
          console.log(
            "SendPulse тег 'vstyp1' відправлено успішно (одноразово) для contactId:",
            contactId
          );
        } catch (error) {
          console.error(
            "Помилка при відправці SendPulse тегу 'vstyp1':",
            error
          );
        }
      } else {
        console.warn(
          "Contact ID не знайдено в localStorage. SendPulse тег 'vstyp1' не відправлено."
        );
      }
    };

    // -------------------------------------------
    // ОДНОРАЗОВА ВІДПРАВКА ПОДІЇ В SENDPULSE EVENTS (POST)
    // -------------------------------------------
    const sendSendPulseEvent = async () => {
      if (!contactId) {
        console.warn(
          'Contact ID не знайдено в localStorage. SendPulse Event не відправлено.'
        );
        return;
      }

      // унікальний флаг на рівні contactId, щоб не дублювати запит
      const flagKey = `${SENDPULSE_EVENT_FLAG}:${contactId}`;
      if (localStorage.getItem(flagKey)) {
        console.info('SendPulse Event вже було відправлено раніше. Пропускаю.');
        return;
      }

      const url =
        'https://events.sendpulse.com/events/id/4edc2ef573b946fdefa7ada4749fee0c/8940703';

      const payload = {
        email: 'sukomyzukrainy@proton.me', // стандарт
        chatbots_channel: 'tg', // стандарт
        chatbots_subscriber_id: contactId, // contact_id юзера
        event_date: new Date().toISOString(), // дата відправки в UTC
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // таймаут 8с

      try {
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
          // mode: "no-cors", // ← розкоментуй, якщо впирається в CORS
        });

        localStorage.setItem(flagKey, '1');
        console.log(
          'SendPulse Event (POST) відправлено успішно (одноразово) для contactId:',
          contactId
        );
      } catch (error) {
        console.error('Помилка при відправці SendPulse Event (POST):', error);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Запускаємо всі три дії при монтуванні компонента
    sendChatterfyPostback();
    sendSendPulseTag();
    sendSendPulseEvent();
  }, []); // запускається один раз при монтуванні

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
        <Title variant="h2" className="text-[#181717] text-center mb-8">
          Знакомство с платформой
        </Title>
        {/* <IntroductionHeader isFirstPage={true} /> */}
        <IntroductionContent
          title="Что такое трейдинг: просто о главном"
          description="Узнай, как работает финансовый рынок и почему трейдинг — это не азарт, а система. Мы разберём, кто такие трейдеры, как они зарабатывают на движении цен и почему каждый человек может освоить этот навык. Ты увидишь реальные примеры сделок и поймёшь, что для старта не нужны миллионы — достаточно знаний и правильного подхода. Этот урок разрушит мифы и покажет, что трейдинг — это инструмент для тех, кто хочет контролировать свой доход."
          videoSrc="https://vz-774045bd-680.b-cdn.net/f4189520-fabc-465b-813f-4c090cf92998/playlist.m3u8"
          thumbnail="https://vz-774045bd-680.b-cdn.net/f4189520-fabc-465b-813f-4c090cf92998/thumbnail_b9607889.jpg"
          headerIcon={wayIcon}
          isActive={true}
          index={0}
          totalItems={0}
          onNext={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </div>

      <div className="px-4 pb-[calc(2rem+var(--safe-bottom))]">
        <LinkComponent to="/welcome-second" className="link-next w-full">
          <Title variant="h3">Следующий урок</Title>
        </LinkComponent>
      </div>
    </div>
  );
};

export default WelcomeFirstPage;
