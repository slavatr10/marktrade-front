import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import bgImage from '@/assets/images/main-bg.png';
import { useSendPulseTag } from '@/hooks/useSendPulse';
import IntroLayout from '@/components/introLayout/introLayout.tsx';
import { GlobalLoader, IntroductionContent } from '@/components';
import welcomeThumbnail from '@/assets/images/welcome-2-thumb.jpg';
import welcomeThumbnailNext from '@/assets/images/welcome-3-thumb.jpg';
import { preloadImages } from '@/utils/preloadImages';

// Оголошуємо унікальні ключі для localStorage для цієї сторінки
const CHATTERFY_POSTBACK_FLAG_2 = 'chatterfy_vstyp2_postback_sent';
const SENDPULSE_TAG_FLAG_2 = 'sendpulse_vstyp2_tag_sent';

const WelcomeSecondPage = () => {
  const { sendTag } = useSendPulseTag();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const animationIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const storedClickId = localStorage.getItem('click_id');
    const contactId = localStorage.getItem('contact_id');

    // -------------------------------------------
    // GET постбек у Chatterfy (vstyp2) - один раз
    // -------------------------------------------
    const sendChatterfyPostback = async () => {
      // Перевіряємо, чи був вже відправлений postback
      if (localStorage.getItem(CHATTERFY_POSTBACK_FLAG_2)) {
        console.log("Chatterfy 'vstyp2' postback вже було відправлено раніше. Пропускаю.");
        return;
      }

      if (storedClickId) {
        const postbackUrl = `https://api.chatterfy.ai/api/postbacks/f605fba2-697b-4a32-88f8-5cda8d515b91/tracker-postback?tracker.event=vstyp2&clickid=${storedClickId}`;
        try {
          await fetch(postbackUrl, { method: 'GET', mode: 'no-cors' });
          // Встановлюємо прапор після успішної відправки
          localStorage.setItem(CHATTERFY_POSTBACK_FLAG_2, '1');
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
    // Тег "vstyp2" у SendPulse - один раз
    // -------------------------------------------
    const sendSendPulseTag = async () => {
      // Перевіряємо, чи був вже відправлений тег
      if (localStorage.getItem(SENDPULSE_TAG_FLAG_2)) {
        console.log("SendPulse тег 'vstyp2' вже було відправлено раніше. Пропускаю.");
        return;
      }
        
      if (contactId) {
        try {
          await sendTag(contactId, ['vstyp2']);
          // Встановлюємо прапор після успішної відправки
          localStorage.setItem(SENDPULSE_TAG_FLAG_2, '1');
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
      
    // -------------------------------------------
    // Одноразовий POST у SendPulse EVENTS - ЗАКОМЕНТОВАНО ЗА ЗАПИТОМ
    // -------------------------------------------
    /*
    const sendSendPulseEvent = async () => {
        // Логіка для відправки івенту в SendPulse
        // Не забудьте додати перевірку з прапором у localStorage,
        // як у попередніх функціях, щоб уникнути повторень.
    };
    */

    sendChatterfyPostback();
    sendSendPulseTag();
    // sendSendPulseEvent(); // Виклик закоментовано

  }, [sendTag]);

  const handleNextClick = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    animationIntervalRef.current = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 90) {
          return prev + 5;
        } else {
          if (animationIntervalRef.current)
            clearInterval(animationIntervalRef.current);
          return 90;
        }
      });
    }, 50);

    await preloadImages([welcomeThumbnailNext]);

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    setLoadingProgress(100);
    setTimeout(() => {
      navigate({ to: '/registration' });
    }, 100);
  };

  if (isLoading) {
    return <GlobalLoader progress={loadingProgress} />;
  }

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
          description="В этом уроке ты узнаешь, как устроено сообщество Trade University. Мы расскажем, из чего состоит система - обучение, сигналы и поддержка - и как всё это помогает тебе расти шаг за шагом вместе с командой."
          videoSrc="https://vz-774045bd-680.b-cdn.net/76894c8b-5722-4dcc-88f3-d54529cd34cf/playlist.m3u8"
          thumbnail={welcomeThumbnail}
          isActive={true}
          index={0} // Цей індекс, можливо, варто змінити на 1, оскільки це другий крок
          totalItems={2}
          onNext={handleNextClick}
          showNextButton={true}
        />
      </IntroLayout>
    </div>
  );
};

export default WelcomeSecondPage;
