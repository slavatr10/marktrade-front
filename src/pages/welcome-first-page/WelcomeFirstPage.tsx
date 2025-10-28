import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

import IntroLayout from '@/components/introLayout/introLayout.tsx';
import { IntroductionContent} from "@/components";
import { useSendPulseTag } from '@/hooks/useSendPulse';
import bgImage from '@/assets/images/main-bg.png';

import './WelcomeFirstPage.scss';

const SENDPULSE_EVENT_FLAG = 'sp_event_4edc2ef573b946fdefa7ada4749fee0c_sent';

const WelcomeFirstPage = () => {
  const { sendTag } = useSendPulseTag();
  const navigate = useNavigate();

  useEffect(() => {
    const storedClickId = localStorage.getItem('click_id');
    const contactId = localStorage.getItem('contact_id');

    // -------------------------------------------
    // GET постбек у Chatterfy (vstyp1) — один раз
    // -------------------------------------------
    const sendChatterfyPostback = async () => {
      if (storedClickId) {
        const postbackUrl =
          `https://api.chatterfy.ai/api/postbacks/8dd8f7ba-3f29-4da8-9db4-3f04bf067c5e/tracker-postback?tracker.event=vstyp1&clickid=${storedClickId}`;
        try {
          await fetch(postbackUrl, { method: 'GET', mode: 'no-cors' });
          console.log("Chatterfy 'vstyp1' postback відправлено успішно (одноразово).");
        } catch (error) {
          console.error("Помилка при відправці Chatterfy 'vstyp1' postback:", error);
        }
      } else {
        console.warn("Click ID не знайдено в localStorage. Chatterfy 'vstyp1' не відправлено.");
      }
    };

    // -------------------------------------------
    // Тег "vstyp1" у SendPulse — один раз
    // -------------------------------------------
    const sendSendPulseTag = async () => {
      if (contactId) {
        try {
          await sendTag(contactId, ['vstyp1']);
          console.log("SendPulse тег 'vstyp1' відправлено успішно (одноразово) для contactId:", contactId);
        } catch (error) {
          console.error("Помилка при відправці SendPulse тегу 'vstyp1':", error);
        }
      } else {
        console.warn("Contact ID не знайдено в localStorage. SendPulse тег 'vstyp1' не відправлено.");
      }
    };

    // -------------------------------------------
    // Одноразовий POST у SendPulse EVENTS при завантаженні
    // -------------------------------------------
    const sendSendPulseEvent = async () => {
      if (!contactId) {
        console.warn('Contact ID не знайдено в localStorage. SendPulse Event не відправлено.');
        return;
      }

      const flagKey = `${SENDPULSE_EVENT_FLAG}:${contactId}`;
      if (localStorage.getItem(flagKey)) {
        console.info('SendPulse Event вже було відправлено раніше. Пропускаю.');
        return;
      }

      const url = 'https://events.sendpulse.com/events/id/4edc2ef573b946fdefa7ada4749fee0c/8940703';
      const payload = {
        email: 'sukomyzukrainy@proton.me',
        chatbots_channel: 'tg',
        chatbots_subscriber_id: contactId,
        event_date: new Date().toISOString(),
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
          // mode: 'no-cors',
        });

        localStorage.setItem(flagKey, '1');
        console.log('SendPulse Event (POST) відправлено успішно (одноразово) для contactId:', contactId);
      } catch (error) {
        console.error('Помилка при відправці SendPulse Event (POST):', error);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    sendChatterfyPostback();
    sendSendPulseTag();
    sendSendPulseEvent();
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
      <IntroLayout title="Знакомство с платформой" backTo="/">
        <IntroductionContent
          title="Что такое трейдинг: просто о главном"
          description="Узнай, как работает финансовый рынок и почему трейдинг — это не азарт, а система. Мы разберём, кто такие трейдеры, как они зарабатывают на движении цен и почему каждый человек может освоить этот навык."
          videoSrc="https://vz-774045bd-680.b-cdn.net/f4189520-fabc-465b-813f-4c090cf92998/playlist.m3u8"
          thumbnail="https://vz-774045bd-680.b-cdn.net/f4189520-fabc-465b-813f-4c090cf92998/thumbnail_b9607889.jpg"
          isActive={true}
          index={0}
          totalItems={2}
          onNext={() => navigate({ to: '/welcome-second' })}
          showNextButton={true}
        />
      </IntroLayout>
    </div>
  );
};

export default WelcomeFirstPage;
