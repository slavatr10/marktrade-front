interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
}

interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  chat?: any;
  chat_type?: string;
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitData;
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: any;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;

  ready(): void;
  expand(): void;
  close(): void;

  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setParams(params: any): void;
  };

  BackButton: {
    isVisible: boolean;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };

  HapticFeedback: {
    impactOccurred(
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ): void;
    notificationOccurred(type: "error" | "success" | "warning"): void;
    selectionChanged(): void;
  };

  showPopup(params: any, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  showScanQrPopup(params: any, callback?: (text: string) => void): void;
  closeScanQrPopup(): void;
  readTextFromClipboard(callback?: (text: string) => void): void;
  requestWriteAccess(callback?: (granted: boolean) => void): void;
  requestContact(callback?: (granted: boolean, contact?: any) => void): void;

  onEvent(eventType: string, eventHandler: () => void): void;
  offEvent(eventType: string, eventHandler: () => void): void;
  sendData(data: string): void;

  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;

  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
}

interface TelegramSDK {
  WebApp: TelegramWebApp;
}

declare global {
  interface Window {
    Telegram: TelegramSDK;
  }
}

export {};
