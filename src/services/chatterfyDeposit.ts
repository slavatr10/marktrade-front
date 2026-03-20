import { sendChatterfyEvent } from "@/services/chatterfy";

const DEPOSIT_EVENT = "readytodep";

export const sendChatterfyDepositPostback = async (
  clickId: string
): Promise<void> => {
  await sendChatterfyEvent(DEPOSIT_EVENT, clickId);
};

