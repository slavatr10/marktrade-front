import { useEffect } from "react";

export function useTelegramSafeArea() {
    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        const inset = tg?.contentSafeAreaInset; // { top, bottom, left, right } або undefined
        if (!inset) return;

        const root = document.documentElement;
        root.style.setProperty("--safe-top", `${inset.top || 0}px`);
        root.style.setProperty("--safe-bottom", `${inset.bottom || 0}px`);
    }, []);
}
