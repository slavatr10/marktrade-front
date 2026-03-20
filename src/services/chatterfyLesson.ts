import { CHATTERFY_CONFIG } from "@/constants/chatterfy";
import { sendChatterfyEvent } from "@/services/chatterfy";

export const sendChatterfyLessonPostback = async (
  lessonOrder: number,
  clickId: string
): Promise<void> => {
  const { min, max } = CHATTERFY_CONFIG.LESSON_RANGE;

  if (lessonOrder < min || lessonOrder > max) return;

  const event = `lesson${lessonOrder}`;
  await sendChatterfyEvent(event, clickId);
};

