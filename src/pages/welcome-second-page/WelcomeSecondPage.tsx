import { useEffect } from "react";
import {
    IntroductionHeader,
    LinkComponent,
} from "@/components";
import { useSendPulseTag } from "@/hooks/useSendPulse";

const WelcomeSecondPage = () => {
    const { sendTag } = useSendPulseTag();

    useEffect(() => {
        const storedClickId = localStorage.getItem("click_id");
        const contactId = localStorage.getItem("contact_id");

        // -------------------------------------------
        // ВІДПРАВКА ЗАПИТУ НА ТРЕКЕР CHATTERFY (vstyp2)
        // -------------------------------------------
        const sendChatterfyPostback = async () => {
            if (storedClickId) {
                const postbackUrl = `https://api.chatterfy.ai/api/postbacks/8dd8f7ba-3f29-4da8-9db4-3f04bf067c5e/tracker-postback?tracker.event=vstyp2&clickid=${storedClickId}`;
                try {
                    await fetch(postbackUrl, {
                        method: 'GET',
                        mode: 'no-cors'
                    });
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
                    await sendTag(contactId, ["vstyp2"]);
                    console.log("SendPulse тег 'vstyp2' відправлено успішно (одноразово) для contactId:", contactId);
                } catch (error) {
                    console.error("Помилка при відправці SendPulse тегу 'vstyp2':", error);
                }
            } else {
                console.warn("Contact ID не знайдено в localStorage. SendPulse тег 'vstyp2' не відправлено.");
            }
        };

        // Запускаємо обидві функції при монтуванні компонента
        sendChatterfyPostback();
        sendSendPulseTag();

    }, []); // <--- ЗМІНЕНО: Пустий масив залежностей, щоб ефект запускався лише один раз
            //  при першому рендері (монтуванні компонента).

    return (
        <div className="flex min-h-screen w-full flex-col justify-between bg-natural-950 pt-[calc(5.2rem+var(--safe-top))]">
            <div className="px-4">
                <IntroductionHeader isSecondPage={true} />

                {/* <IntroductionContent
                    title="Вступний урок №2"
                    description="У цьому уроці я розбираю головні страхи новачків: “це складно”, “я нічого не вмію”, “я буду сам”.
          Покажу, як наша система — покрокове навчання, щоденні сигнали та підтримка ком’юніті — допомагає пройти цей шлях швидко, впевнено і з реальними результатами вже з перших днів.
          Тут ви зрозумієте: трейдинг — це не про самотність і складність, а про правильне оточення та прості дії"
                    videoSrc="https://vz-3325699a-726.b-cdn.net/ddd7c6f7-b637-420f-9a7a-a675dea76a81/playlist.m3u8"
                    thumbnail="https://spro-trade.b-cdn.net/EDU3/v2.jpg"
                /> */}
            </div>
                <div className="px-4 pb-[calc(2rem+var(--safe-bottom))]">

                <LinkComponent to="/registration" className="link-next w-full mb-5">
                    Розпочати навчання
                </LinkComponent>
                </div>
        </div>
    );
};

export default WelcomeSecondPage;