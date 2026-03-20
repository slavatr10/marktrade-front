import { useEffect } from "react";
import { useSendPulseTag } from "@/hooks/useSendPulse";
import { sendChatterfyEvent } from "@/services";

interface WelcomeTrackingConfig {
  chatterfyEvent?: string;
  sendPulseTag?: string;
  sendPulseEventId?: string;
  sendPulseEventFlag?: string;
}

export const useWelcomeTracking = (config: WelcomeTrackingConfig) => {
  const { sendTag } = useSendPulseTag();

  useEffect(() => {
    const storedClickId = localStorage.getItem("click_id");
    const contactId = localStorage.getItem("contact_id");

    const sendChatterfyPostback = async () => {
      if (!config.chatterfyEvent) return;
      if (!storedClickId) return;

      try {
        await sendChatterfyEvent(config.chatterfyEvent, storedClickId);
      } catch (error) {
        console.error(
          `Помилка при відправці Chatterfy '${config.chatterfyEvent}' postback:`,
          error
        );
      }
    };

    const sendSendPulseTag = async () => {
      if (!config.sendPulseTag) return;
      if (!contactId) return;

      try {
        await sendTag(contactId, [config.sendPulseTag]);
      } catch (error) {
        console.error(
          `Помилка при відправці SendPulse тегу '${config.sendPulseTag}':`,
          error
        );
      }
    };

    const sendSendPulseEvent = async () => {
      if (!config.sendPulseEventId || !config.sendPulseEventFlag) return;
      if (!contactId) return;

      const flagKey = `${config.sendPulseEventFlag}:${contactId}`;
      if (localStorage.getItem(flagKey)) return;

      const url = `https://events.sendpulse.com/events/id/${config.sendPulseEventId}/8940703`;

      const payload = {
        email: "sukomyzukrainy@proton.me",
        chatbots_channel: "tg",
        chatbots_subscriber_id: contactId,
        event_date: new Date().toISOString(),
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        localStorage.setItem(flagKey, "1");
      } catch (error) {
        console.error("Помилка при відправці SendPulse Event (POST):", error);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    void sendChatterfyPostback();
    void sendSendPulseTag();
    void sendSendPulseEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
