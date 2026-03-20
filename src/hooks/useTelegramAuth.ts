import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAuthTelegram } from "@/api/auth";
import { useSendPulseTag } from "@/hooks/useSendPulse";

type AuthStatus =
  | "loading"
  | "authenticated"
  | "no-access"
  | "welcome"
  | "error";

interface TelegramUser {
  id: number;
  username?: string;
}

interface UseTelegramAuthReturn {
  status: AuthStatus;
  resetNoAccess: () => void;
  isTelegramAuthLoading: boolean;
}

/** ───────────── storage helpers ───────────── */
const saveTelegramUser = (user: TelegramUser) => {
  localStorage.setItem("user_name", user.username || "");
  localStorage.setItem("user_id", String(user.id));
};

const saveUserData = (clickId: string, contactId: string) => {
  localStorage.setItem("click_id", clickId || "");
  localStorage.setItem("contact_id", contactId || "");
};

const saveTokens = (accessToken?: string, refreshToken?: string) => {
  if (accessToken) sessionStorage.setItem("access_token", accessToken);
  if (refreshToken) sessionStorage.setItem("refresh_token", refreshToken);
};

/** ───────────── Telegram bootstrap ─────────────
 * В index.html підключи SDK перед твоїм module-скриптом і з `defer`:
 * <script src="https://telegram.org/js/telegram-web-app.js" defer></script>
 * <script type="module" src="/src/index.tsx"></script>
 */
const initializeTelegramWebApp = (): boolean => {
  const tg = (window as any).Telegram?.WebApp;
  if (!tg) return false;

  try {
    tg.ready();
    tg.expand?.();
    const user = tg.initDataUnsafe?.user as TelegramUser | undefined;
    if (!user?.id) return false;
    saveTelegramUser(user);
    return true;
  } catch {
    return false;
  }
};

/** Короткий полінг SDK: 100мс, максимум ~3с */
const waitForTelegramSDK = (timeoutMs = 3000, stepMs = 100): Promise<boolean> =>
  new Promise((resolve) => {
    if ((window as any).Telegram?.WebApp) return resolve(true);
    let elapsed = 0;
    const id = window.setInterval(() => {
      if ((window as any).Telegram?.WebApp) {
        clearInterval(id);
        resolve(true);
      } else if ((elapsed += stepMs) >= timeoutMs) {
        clearInterval(id);
        resolve(false);
      }
    }, stepMs);
  });

/** ───────────── Наперед підвантажити чанк головної сторінки ─────────────
 * Шлях має бути ТОЧНО як у твоєму lazy-імпорті для /main
 * (приклад: "@/pages/main-page/MainPage").
 */
// const preloadMainPageChunk = async () => {
//     try {
//         await import("@/pages/main-page/MainPage");
//     } catch {
//         // Якщо шлях інший - просто прибери цей прелод
//     }
// };

/** ───────────── API response handler ───────────── */
const handleAuthResponse = async (
  response: any,
  navigate: ReturnType<typeof useNavigate>,
  sendTag: (contactId: string, tags: string[]) => Promise<boolean>,
): Promise<AuthStatus> => {
  if (response?.isError) {
    switch (response.status) {
      case 404:
        return "no-access";
      case 401:
        saveUserData(
          response.data?.clickId || "",
          String(response.data?.contactId || ""),
        );
        navigate({ to: "/start" });
        return "welcome";
      default:
        return "error";
    }
  }

  // токени, якщо є
  saveTokens(
    response.data?.tokens?.accessToken,
    response.data?.tokens?.refreshToken,
  );

  // повна реєстрація
  if (response.data?.user?.registration) {
    const clickId = response.data.user.clickId || "";
    const contactId = String(response.data.user.contactId || "");

    // зберігаємо саме contactId у localStorage.contact_id
    saveUserData(clickId, contactId);

    if (contactId) {
      try {
        await sendTag(contactId, ["regdone"]);
      } catch {}
    }
    return "authenticated";
  }

  return "authenticated";
};

/** ───────────── main hook ───────────── */
export const useTelegramAuth = (): UseTelegramAuthReturn => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { sendTag } = useSendPulseTag();

  // Гард від подвійного запуску ефекту під StrictMode
  const hasRunRef = useRef(false);
  // Захист від setState після анмаунта
  const mountedRef = useRef(true);

  const resetNoAccess = () => setStatus("loading");

  useEffect(() => {
    mountedRef.current = true;

    const run = async () => {
      // 🛡️ не дозволяємо повторний старт у StrictMode
      if (hasRunRef.current) return;
      hasRunRef.current = true;
      setIsLoading(true);

      try {
        const sdkAvailable = await waitForTelegramSDK();
        if (!sdkAvailable) {
          if (mountedRef.current) setStatus("error");
          return;
        }

        const ok = initializeTelegramWebApp();
        if (!ok) {
          if (mountedRef.current) setStatus("error");
          return;
        }

        const userId = localStorage.getItem("user_id") || "";
        if (!userId) {
          if (mountedRef.current) setStatus("error");
          return;
        }

        const response = await getAuthTelegram(userId);
        const newStatus = await handleAuthResponse(response, navigate, sendTag);
        if (mountedRef.current) setStatus(newStatus);
      } catch (error) {
        if (mountedRef.current) setStatus("error");
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      mountedRef.current = false;
    };
  }, [navigate, sendTag]);

  return { status, resetNoAccess, isTelegramAuthLoading: isLoading };
};
