import { useState, useEffect, useRef } from 'react';
import { getAuthTelegram } from '@/api/auth';
import { Button, LinkComponent, SuccessPage, VideoPlayer } from '@/components';
import { useSendPulseTag } from '@/hooks/useSendPulse';
import bgImage from '@/assets/images/main-bg.png';
import { Body, Title } from '@/components/typography';

const SENDPULSE_EVENT_FLAG = 'sp_event_136f6be1a25b488afabce0671ab99e9c_sent';
const spTagFlagKey = (contactId: string) =>
  `sp_tag_readytodep_sent:${contactId}`;
const chatterfyFlagKey = (clickId: string) =>
  `chatterfy_readytodep_sent:${clickId}`;

const DepositPage = () => {
  const [loadingCheckDeposit, setLoadingCheckDeposit] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const userId = localStorage.getItem('user_id') || '';
  // const search = useSearch({ from: '/deposit' });

  // важливо: збережемо поточну функцію у ref, щоб не мінялась у залежностях
  const { sendTag } = useSendPulseTag();
  const sendTagRef = useRef(sendTag);
  sendTagRef.current = sendTag;

  const ranRef = useRef(false); // захист від подвійного виклику (StrictMode/ремаути)
  // const courseId = search.courseId || localStorage.getItem('courseId');

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const storedClickId = localStorage.getItem('click_id') || '';
    const contactId = localStorage.getItem('contact_id') || '';

    // --- SendPulse Tag (one-time per contact) ---
    const sendSendPulseTag = async () => {
      if (!contactId) return;
      const flagKey = spTagFlagKey(contactId);
      if (localStorage.getItem(flagKey)) {
        console.info('SendPulse tag already sent. Skipping.');
        return;
      }
      try {
        await sendTagRef.current(contactId, ['readytodep']);
        localStorage.setItem(flagKey, '1');
        console.log("SendPulse tag 'readytodep' sent once.");
      } catch (error) {
        console.error('SendPulse tag error:', error);
      }
    };

    // --- Chatterfy Postback (one-time per clickId) ---
    const sendChatterfyPostback = async () => {
      if (!storedClickId) return;
      const flagKey = chatterfyFlagKey(storedClickId);
      if (localStorage.getItem(flagKey)) {
        console.info('Chatterfy postback already sent. Skipping.');
        return;
      }
      const postbackUrl =
        `https://api.chatterfy.ai/api/postbacks/8dd8f7ba-3f29-4da8-9db4-3f04bf067c5e/` +
        `tracker-postback?tracker.event=readytodep&clickid=${encodeURIComponent(
          storedClickId
        )}`;
      try {
        await fetch(postbackUrl, { method: 'GET', mode: 'no-cors' });
        localStorage.setItem(flagKey, '1');
        console.log("Chatterfy 'readytodep' postback sent once.");
      } catch (error) {
        console.error('Chatterfy postback error:', error);
      }
    };

    // --- SendPulse Events POST (already one-time per contact) ---
    const sendSendPulseEvent = async () => {
      if (!contactId) {
        console.warn('No contactId. Skipping SendPulse Event.');
        return;
      }
      const flagKey = `${SENDPULSE_EVENT_FLAG}:${contactId}`;
      if (localStorage.getItem(flagKey)) {
        console.info('SendPulse Event already sent. Skipping.');
        return;
      }

      const url =
        'https://events.sendpulse.com/events/id/136f6be1a25b488afabce0671ab99e9c/8940703';
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
          // mode: "no-cors", // розкоментувати тільки якщо справді впирається у CORS
        });
        localStorage.setItem(flagKey, '1');
        console.log('SendPulse Event POST sent once.');
      } catch (error) {
        console.error('SendPulse Event POST error:', error);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // запускаємо паралельно, але незалежно
    void sendSendPulseTag();
    void sendChatterfyPostback();
    void sendSendPulseEvent();
  }, []); // <- ПУСТИЙ масив залежностей — ефект тільки на маунт

  const handleVerifyDeposit = async () => {
    setLoadingCheckDeposit(true);
    try {
      const isDepositSuccess = await getAuthTelegram(userId);
      if (isDepositSuccess?.data?.user?.deposit) {
        localStorage.setItem('deposit', 'true');
        setDepositSuccess(true);
      } else {
        setDepositSuccess(false);
      }
    } catch (error) {
      console.error('Ошибка проверки депозита:', error);
      setDepositSuccess(false);
    } finally {
      setButtonClicked(true);
      setLoadingCheckDeposit(false);
    }
  };

  if (buttonClicked) {
    return (
      <SuccessPage
        type={depositSuccess ? 'success' : 'failure'}
        text={depositSuccess ? 'Депозит успешен!' : 'Депозит не подтвержден'}
        linkUrl={`/`}
        linkText={depositSuccess ? 'Продолжить' : 'Попробовать еще раз'}
        setButtonClicked={setButtonClicked}
      />
    );
  }

  const buildDepositUrl = () => {
    const cid = localStorage.getItem('click_id') || '';
    const base =
      'https://u3.shortink.io/register?utm_campaign=802555&utm_source=affiliate&utm_medium=sr&a=jy9IGDHoNUussf&ac=bot-protrd&code=YRL936';
    return cid ? `${base}&click_id=${encodeURIComponent(cid)}` : base;
  };

  return (
    <div
      className="flex flex-col min-h-screen p-4 bg-neutral-950 rounded shadow-md pt-[calc(5.2rem+var(--safe-top))] pb-[calc(2rem+var(--safe-bottom))]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* <IntroductionHeader type="text" title="" /> */}
      <Title variant="h1" className="mb-6 text-[#181717] text-center">
        Депозит на платформе
      </Title>
      <div className={`w-full rounded-2xl mb-8`}>
        <VideoPlayer
          src={
            'https://iframe.mediadelivery.net/play/511840/6ae24a8c-62f7-4044-b181-92ab1c95d8dc'
          }
          thumbnail={'https://spro-trade.b-cdn.net/EDU3/v1.jpg'}
        />
      </div>
      <div className="flex flex-col gap-6 mb-10">
        <Body variant="mdRegular" className="text-[#323030]">
          Ты уже сделал главное — решил разобраться в трейдинге. Теперь важно
          перейти к практике. Пополни счёт на платформе, созданный по моей
          ссылке - это подтвердит, что ты в команде, и откроет доступ ко всем
          инструментам
        </Body>
        <Body variant="mdRegular" className="text-[#323030]">
          <b>Практика</b> - ключ к результату. Даже минимальный
          депозит помогает почувствовать рынок изнутри.
          <br /> <b>После пополнения</b> ты получишь доступ к закрытым
          материалам, аналитике и сигналам в реальном времени.
          <br />
          <b>Комьюнити и поддержка</b> <br />
          Ты не один - рядом трейдеры, которые идут тем же путём
        </Body>
        <Body variant="mdRegular" className="text-[#323030]">
          <b>Условия:</b> Минимум 15$ - чтобы начать спокойно.
          Оптимально от 100$ чтобы видеть реальный результат.
        </Body>
        <Body variant="mdRegular" className="text-[#323030]">
          <b>Важно:</b> депозит - это не трата. Это твои деньги, ты
          можешь вывести их в любой момент.
        </Body>
      </div>
      <LinkComponent
        to={buildDepositUrl()}
        target="_blank"
        className="w-full mb-3"
      >
        <Title variant="h6">Сделать депозит</Title>
      </LinkComponent>

      <Button
        className="w-full"
        onClick={handleVerifyDeposit}
        title="Проверить"
        isLoading={loadingCheckDeposit}
        styledClassName="!text-[#181717]"
      />
    </div>
  );
};

export default DepositPage;
