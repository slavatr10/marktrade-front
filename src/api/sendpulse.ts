import axios from 'axios';
import { authBody } from '@/constants';

const sendPulseApi = axios.create({
  baseURL: 'https://api.sendpulse.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface SendPulseAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SetTagPayload {
  contact_id: string;
  tags: string[];
}

interface SendMessagePayload {
  contact_id: string;
  message: {
    type: string;
    text: string;
    reply_markup?: {
      inline_keyboard: Array<
        Array<{
          text: string;
          type: string;
          url: string;
        }>
      >;
    };
  };
}

const getAuthToken = async (): Promise<string | null> => {
  try {
    const response = await sendPulseApi.post<SendPulseAuthResponse>(
      '/oauth/access_token',
      authBody
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Помилка отримання токена SendPulse:', error);
    return null;
  }
};

export const setContactTag = async (
  contactId: string,
  tags: string[]
): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    if (!token) return false;

    const payload: SetTagPayload = {
      contact_id: contactId,
      tags,
    };

    await sendPulseApi.post('/telegram/contacts/setTag', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error) {
    console.error('Помилка встановлення тегу SendPulse:', error);
    return false;
  }
};

export const sendContactMessage = async (
  contactId: string,
  text: string,
  replyMarkup?: any
): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    if (!token) return false;

    const payload: SendMessagePayload = {
      contact_id: contactId,
      message: {
        type: 'text',
        text,
        ...(replyMarkup && { reply_markup: replyMarkup }),
      },
    };

    await sendPulseApi.post('/telegram/contacts/send', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error) {
    console.error('Помилка відправки повідомлення SendPulse:', error);
    return false;
  }
};

export const sendDepositNotification = async (
  contactId: string
): Promise<boolean> => {
  try {
    if (!contactId) {
      console.warn('ContactId не надано для SendPulse');
      return false;
    }

    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'Отримати доступ',
            type: 'web_url',
            url: 'https://t.me/+bLGCOTuHoMY3MTQy',
          },
        ],
      ],
    };

    const [tagResult, messageResult] = await Promise.all([
      setContactTag(contactId, ['depdone']),
      sendContactMessage(
        contactId,
        'Ваш депозит успешен! Вот доступ к сигналам',
        replyMarkup
      ),
    ]);

    return tagResult && messageResult;
  } catch (error) {
    console.error('Помилка відправки повідомлення про депозит:', error);
    return false;
  }
};
