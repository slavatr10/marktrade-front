import { Course } from "./Course";
import { Lesson } from "./Lesson";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TelegramAuthResponse {
  user: TelegramUser;
  tokens: TokenResponse;
  __error__?: string;
}

export interface TelegramUser {
  id: string;
  clickId: string;
  telegramId: number;
  traderId: string;
  contactId: null;
  points: number;
  deposit: boolean;
  registration: boolean;
  depositAmount: number;
  createdAt: string;
  updatedAt: string;
  role: string;
  currentLesson: TelegramLesson;
  inviteUrl?: string;
  inviteUrlVip?: string;
}

export interface TelegramCategory {
  id: string;
  order: number;
  name: string;
  description: string;
  lessonsQuantity: number;
  hoursQuantity: number;
  course: Course;
}

export interface TelegramLesson extends Omit<Lesson, "categoryId"> {
  category: TelegramCategory;
}
