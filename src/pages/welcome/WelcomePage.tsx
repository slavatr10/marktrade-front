import { useEffect, useState } from 'react';
import { IntroductionContent, SuccessPage } from '@/components';
import { useSendPulseTag } from '@/hooks/useSendPulse';
import bgImage from '@/assets/images/main-bg.png';
import { Title } from '@/components/typography';
import wayIcon from '@/assets/images/way-icon.png';
import switchIcon from '@/assets/images/switch-icon.png';
import handsIcon from '@/assets/images/hands-icon.png';
import { getAuthTelegram } from '@/api/auth';
import { ROUTES } from '@/constants';
import { useTelegramAuth } from '@/hooks';

const SENDPULSE_EVENT_FLAG = 'sp_event_4edc2ef573b946fdefa7ada4749fee0c_sent';

const contentData = [
  {
    title: 'Что такое трейдинг: просто о главном',
    description:
      'Узнай, как работает финансовый рынок и почему трейдинг — это не азарт, а система. Мы разберём, кто такие трейдеры, как они зарабатывают на движении цен и почему каждый человек может освоить этот навык. Ты увидишь реальные примеры сделок и поймёшь, что для старта не нужны миллионы — достаточно знаний и правильного подхода. Этот урок разрушит мифы и покажет, что трейдинг — это инструмент для тех, кто хочет контролировать свой доход.',
    videoSrc:
      'https://vz-774045bd-680.b-cdn.net/f4189520-fabc-465b-813f-4c090cf92998/playlist.m3u8',
    thumbnail:
      'https://vz-774045bd-680.b-cdn.net/f4189520-fabc-465b-813f-4c090cf92998/thumbnail_b9607889.jpg',
    headerIcon: wayIcon,
    isRegister: false,
  },
  {
    title: 'Наша команда и система обучения',
    description:
      'Мы расскажем, почему наша методика работает, как построено обучение, и за счёт чего результаты приходят быстро и без перегрузки. Ты узнаешь, чем наша команда отличается от других: ежедневная поддержка, пошаговая стратегия и реальная торговая практика под руководством наставников. После этого урока у тебя появится уверенность, что ты не один — за твоей спиной будет команда, которая поможет на каждом этапе.',
    videoSrc:
      'https://vz-3325699a-726.b-cdn.net/ddd7c6f7-b637-420f-9a7a-a675dea76a81/playlist.m3u8',
    thumbnail: 'https://spro-trade.b-cdn.net/EDU3/v2.jpg',
    headerIcon: switchIcon,
    isRegister: false,
  },
  {
    title: 'Регистрация на торговой платформе',
    description:
      'Пора перейти от теории к практике. В этом видео ты узнаешь, как пройти регистрацию на торговой платформе, подтвердить свой аккаунт и выполнить базовые настройки для начала работы. Мы покажем каждый шаг прямо на экране — без спешки и путаницы, чтобы ты мог просто повторять за нами и всё сделать правильно с первого раза. После этого ты сможешь войти в личный кабинет, протестировать платформу и совершить свою первую демо-сделку. ⚠️ Важно: чтобы перейти к следующему модулю и открыть доступ к следующим урокам, тебе необходимо завершить регистрацию на платформе.',
    videoSrc:
      'https://vz-3325699a-726.b-cdn.net/3cfe4f01-391b-4b75-b8e8-b8a121442d32/playlist.m3u8',
    thumbnail: 'https://spro-trade.b-cdn.net/EDU3/reg.jpg',
    headerIcon: handsIcon,
    isRegister: true,
  },
];

const WelcomePage = () => {
  useTelegramAuth();
  const { sendTag } = useSendPulseTag();
  const [activeIndex, setActiveIndex] = useState(0);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);

  const handleRegisterCheckUp = async () => {
    const userId = localStorage.getItem('user_id') || '';
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

  useEffect(() => {
    const storedClickId = localStorage.getItem('click_id');
    const contactId = localStorage.getItem('contact_id');

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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
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

    sendChatterfyPostback();
    sendSendPulseTag();
    sendSendPulseEvent();
  }, []);

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
      <div className="px-4">
        <Title variant="h1" className="text-[#181717] text-center mb-9">
          ВВЕДЕНИЕ И ПЕРВЫЕ ШАГИ
        </Title>
        <div className="flex flex-col">
          {contentData.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className="relative cursor-pointer pl-12"
            >
              <div className="absolute left-0 top-0 h-full w-8">
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[27px] h-[27px] rounded-full border-[1.5px] border-[#B0B3B8] bg-[#F1F1EE] z-10 "></div>

                {index < contentData.length - 1 && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 h-full w-[2px] bg-[#404040]"></div>
                )}
              </div>

              <IntroductionContent
                {...item}
                isActive={activeIndex === index}
                onRegisterCheck={
                  item.isRegister ? handleRegisterCheckUp : undefined
                }
              />
            </div>
          ))}
        </div>
        {/* <IntroductionHeader isFirstPage={true} /> */}
      </div>

      {/* <div className="px-4 pb-[calc(2rem+var(--safe-bottom))]">
        <LinkComponent to="/welcome-second" className="link-next w-full">
          Далі
        </LinkComponent>
      </div> */}
    </div>
  );
};

export default WelcomePage;
