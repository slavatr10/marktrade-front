import { useEffect, useRef } from "react";
import { useSendPulseTag } from "@/hooks/useSendPulse";
import { sendChatterfyDepositPostback } from "@/services";
import {
  getChatterfyFlagKey,
  getSpTagFlagKey,
  isFlagSet,
  setFlag,
} from "@/utils/depositFlags";

export const useDepositTracking = () => {
  const { sendTag } = useSendPulseTag();
  const sendTagRef = useRef(sendTag);
  sendTagRef.current = sendTag;

  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const storedClickId = localStorage.getItem("click_id") || "";
    const contactId = localStorage.getItem("contact_id") || "";

    const sendSendPulseTag = async () => {
      if (!contactId) return;
      const flagKey = getSpTagFlagKey(contactId);
      if (isFlagSet(flagKey)) return;
      try {
        const ok = await sendTagRef.current(contactId, ["readytodep"]);
        if (ok) setFlag(flagKey);
      } catch (error) {
        console.error("SendPulse tag error:", error);
      }
    };

    const sendChatterfyPostback = async () => {
      if (!storedClickId) return;
      const flagKey = getChatterfyFlagKey(storedClickId);
      if (isFlagSet(flagKey)) return;
      try {
        await sendChatterfyDepositPostback(storedClickId);
        setFlag(flagKey);
      } catch (error) {
        console.error("Chatterfy postback error:", error);
      }
    };

    void sendSendPulseTag();
    void sendChatterfyPostback();
  }, []);
};

