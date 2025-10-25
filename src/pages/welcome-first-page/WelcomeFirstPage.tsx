import { useEffect } from "react";
import {
    IntroductionContent,
    IntroductionHeader,
    LinkComponent,
} from "@/components";
import { useSendPulseTag } from "@/hooks/useSendPulse";

const SENDPULSE_EVENT_FLAG = "sp_event_4edc2ef573b946fdefa7ada4749fee0c_sent";

const WelcomeFirstPage = () => {
    const { sendTag } = useSendPulseTag();

    useEffect(() => {
        const storedClickId = localStorage.getItem("click_id");
        const contactId = localStorage.getItem("contact_id");

        // -------------------------------------------
        // ВІДПРАВКА ЗАПИТУ НА ТРЕКЕР CHATTERFY (vstyp1)
        // -------------------------------------------
        const sendChatterfyPostback = async () => {
            if (storedClickId) {
                const postbackUrl = `https://api.chatterfy.ai/api/postbacks/8dd8f7ba-3f29-4da8-9db4-3f04bf067c5e/tracker-postback?tracker.event=vstyp1&clickid=${storedClickId}`;
                try {
                    await fetch(postbackUrl, {
                        method: "GET",
                        mode: "no-cors",
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
                    await sendTag(contactId, ["vstyp1"]);
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
                    "Contact ID не знайдено в localStorage. SendPulse Event не відправлено."
                );
                return;
            }

            // унікальний флаг на рівні contactId, щоб не дублювати запит
            const flagKey = `${SENDPULSE_EVENT_FLAG}:${contactId}`;
            if (localStorage.getItem(flagKey)) {
                console.info("SendPulse Event вже було відправлено раніше. Пропускаю.");
                return;
            }

            const url =
                "https://events.sendpulse.com/events/id/4edc2ef573b946fdefa7ada4749fee0c/8940703";

            const payload = {
                email: "sukomyzukrainy@proton.me", // стандарт
                chatbots_channel: "tg", // стандарт
                chatbots_subscriber_id: contactId, // contact_id юзера
                event_date: new Date().toISOString(), // дата відправки в UTC
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // таймаут 8с

            try {
                await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                    // mode: "no-cors", // ← розкоментуй, якщо впирається в CORS
                });

                localStorage.setItem(flagKey, "1");
                console.log(
                    "SendPulse Event (POST) відправлено успішно (одноразово) для contactId:",
                    contactId
                );
            } catch (error) {
                console.error("Помилка при відправці SendPulse Event (POST):", error);
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
        <div className="flex min-h-screen w-full flex-col justify-between bg-natural-950 pt-[calc(5.2rem+var(--safe-top))]">
            <div className="px-4">
                <IntroductionHeader isFirstPage={true} />
                <IntroductionContent
                    title="Вступний урок №1"
                    description="У цьому уроці я розповідаю свою історію — як пройшов шлях від будівництва до стабільного заробітку в трейдингу. Ти дізнаєшся, що таке трейдинг насправді, як на ньому заробляють і чому це не гра, а реальна професія. Все чесно, без води і без пафосу — щоб ти міг зрозуміти, з чого почати."
                    videoSrc="https://vz-3325699a-726.b-cdn.net/98ed0593-3666-4c8f-a2eb-d430191c5548/playlist.m3u8"
                    thumbnail="https://spro-trade.b-cdn.net/EDU3/v1.jpg" headerIcon={""} isActive={false}                />
            </div>

            <div className="px-4 pb-[calc(2rem+var(--safe-bottom))]">
                <LinkComponent to="/welcome-second" className="link-next w-full">
                    Далі
                </LinkComponent>
            </div>
        </div>
    );
};

export default WelcomeFirstPage;
