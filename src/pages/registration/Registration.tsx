import { useEffect, useState } from 'react';
import {
  SuccessPage,
  IntroductionHeader,
  Button,
  IntroductionContent,
} from '@/components';
import { getAuthTelegram } from '@/api/auth';
import { useSendPulseTag } from '@/hooks/useSendPulse';
import { ROUTES } from '@/constants';

const SENDPULSE_EVENT_FLAG = 'sp_event_bb7cbbea9d544af3e93c2ad9c6eb366a_sent';

const RegistrationPage = () => {
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const { sendTag } = useSendPulseTag();

  const userId = localStorage.getItem('user_id') || '';

  // -------------------------------------------
  // ТЕГ "linksend" ПРИ ЗАВАНТАЖЕННІ
  // -------------------------------------------
  useEffect(() => {
    const sendLinkSendTag = async () => {
      const contactId = localStorage.getItem('contact_id');
      if (contactId) {
        try {
          await sendTag(contactId, ['linksend']);
          console.log("SendPulse тег 'linksend' відправлено.");
        } catch (e) {
          console.error("Помилка при відправці тегу 'linksend':", e);
        }
      }
    };
    sendLinkSendTag();
  }, [sendTag]);

  // -------------------------------------------
  // GET постбек у Chatterfy (linksend) ПРИ ЗАВАНТАЖЕННІ
  // -------------------------------------------
  useEffect(() => {
    const sendPostbackOnLoad = async () => {
      const storedClickId = localStorage.getItem('click_id');
      if (storedClickId) {
        const postbackUrl = `https://api.chatterfy.ai/api/postbacks/8dd8f7ba-3f29-4da8-9db4-3f04bf067c5e/tracker-postback?tracker.event=linksend&clickid=${storedClickId}`;
        try {
          await fetch(postbackUrl, { method: 'GET', mode: 'no-cors' });
          console.log("Chatterfy 'linksend' postback відправлено.");
        } catch (error) {
          console.error("Помилка Chatterfy 'linksend':", error);
        }
      } else {
        console.warn(
          "Click ID не знайдено. Chatterfy 'linksend' не відправлено."
        );
      }
    };
    sendPostbackOnLoad();
  }, []);

  // -------------------------------------------
  // НОВЕ: ОДНОРАЗОВИЙ POST В SendPulse EVENTS ПРИ ЗАВАНТАЖЕННІ
  // -------------------------------------------
  useEffect(() => {
    const sendSendPulseEvent = async () => {
      const contactId = localStorage.getItem('contact_id');
      if (!contactId) {
        console.warn('Contact ID не знайдено. SendPulse Event не відправлено.');
        return;
      }

      const flagKey = `${SENDPULSE_EVENT_FLAG}:${contactId}`;
      if (localStorage.getItem(flagKey)) {
        console.info('SendPulse Event уже відправлявся. Пропускаю.');
        return;
      }

      const url =
        'https://events.sendpulse.com/events/id/bb7cbbea9d544af3e93c2ad9c6eb366a/8940703';

      const payload = {
        email: 'sukomyzukrainy@proton.me', // стандарт
        chatbots_channel: 'tg', // стандарт
        chatbots_subscriber_id: contactId, // contact_id юзера
        event_date: new Date().toISOString(), // дата відправки (UTC)
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
          // mode: "no-cors", // ← розкоментуй, якщо впирається в CORS
        });
        localStorage.setItem(flagKey, '1');
        console.log('SendPulse Event (POST) відправлено (одноразово).');
      } catch (error) {
        console.error('Помилка SendPulse Event (POST):', error);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    sendSendPulseEvent();
  }, []);

  // --- Решта без змін ---
  if (buttonClicked) {
    return (
      <SuccessPage
        type={registerSuccess ? 'success' : 'failure'}
        text={registerSuccess ? 'Регистрация успешна' : 'Ошибка регистрации'}
        linkUrl={registerSuccess ? ROUTES.HOME : ROUTES.WELCOME}
        linkText={registerSuccess ? 'Продолжить' : 'Повторить'}
        setButtonClicked={setButtonClicked}
        isRegistration
        helperText={
          registerSuccess
            ? ''
            : 'что-то пошло не так, попробуйте еще раз или напишите мне'
        }
      />
    );
  }

  const clickId = localStorage.getItem('click_id');

  const handleRegisterClick = () => {
    if (clickId) {
      const url = `https://u3.shortink.io/register?utm_campaign=802555&utm_source=affiliate&utm_medium=sr&a=jy9IGDHoNUussf&ac=bot-protrd&code=YRL936&click_id=${clickId}`;
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(url);
      } else {
        window.location.href = url;
      }
    } else {
      console.error('Click ID not found in localStorage');
    }
  };

  const handleRegisterCheckUp = async () => {
    try {
      const response = await getAuthTelegram(userId);

      if (response?.data?.user?.registration) {
        sessionStorage.setItem(
          'access_token',
          response.data.tokens.accessToken
        );
        sessionStorage.setItem(
          'refresh_token',
          response.data.tokens.refreshToken
        );
        localStorage.setItem(
          'contact_id',
          response?.data?.user?.contactId || ''
        );

        const contactId = response.data.user.contactId;
        if (contactId) {
          await sendTag(contactId, ['regdone']);
        }

        setRegisterSuccess(true);
      } else {
        setRegisterSuccess(false);
      }
    } catch (error) {
      console.log('Помилка при перевірці реєстрації:', error);
      setRegisterSuccess(false);
    } finally {
      setButtonClicked(true);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-natural-950 pt-[calc(5.2rem+var(--safe-top))]">
      <div className="px-4">
        <IntroductionHeader isThirdPage={true} />
        <IntroductionContent
                  title="Реєстрація на платформі"
                  description="На цьому етапі необхідно створити акаунт на платформі брокера, щоб почати практикуватися та заробляти. Вище представлена детальна відеоінструкція з реєстрації"
                  videoSrc="https://vz-3325699a-726.b-cdn.net/3cfe4f01-391b-4b75-b8e8-b8a121442d32/playlist.m3u8"
                  thumbnail="https://spro-trade.b-cdn.net/EDU3/reg.jpg" headerIcon={''} isActive={false}        />
      </div>

      <div className="flex w-full justify-between flex-col items-center mb-5 gap-2 px-4 pb-[calc(2rem+var(--safe-bottom))]">
        <Button
          title="Зареєструватись"
          onClick={handleRegisterClick}
          isGreen
          className="w-full"
        />
        <Button
          title="Перевірити"
          onClick={handleRegisterCheckUp}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default RegistrationPage;
