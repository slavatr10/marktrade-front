import { CHATTERFY_CONFIG } from "@/constants/chatterfy";

export const sendChatterfyEvent = async (
  event: string,
  clickId: string
): Promise<void> => {
  const postbackUrl = `${CHATTERFY_CONFIG.API_URL}?tracker.event=${encodeURIComponent(
    event
  )}&clickid=${encodeURIComponent(clickId)}`;

  await fetch(postbackUrl, {
    method: "GET",
    mode: "no-cors",
  });
};

