import { useEffect } from "react";

export function useTelegramFullscreen() {
    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        if (!tg) return;

        try {
            tg.ready?.();

            const supportsFs =
                typeof tg.isVersionAtLeast === "function" && tg.isVersionAtLeast("8.0");

            if (supportsFs && typeof tg.requestFullscreen === "function") {
                tg.requestFullscreen();
            } else {
                // fallback для старіших клієнтів
                tg.expand?.();
                tg.setHeaderColor?.("secondary_bg_color");
            }

            const onChanged = (isFs: boolean) => console.log("fullscreen:", isFs);
            const onFailed = (err?: unknown) => console.warn("fullscreen failed", err);
            tg.onEvent?.("fullscreenChanged", onChanged);
            tg.onEvent?.("fullscreenFailed", onFailed);

            return () => {
                tg.offEvent?.("fullscreenChanged", onChanged);
                tg.offEvent?.("fullscreenFailed", onFailed);
            };
        } catch (e) {
            console.error("Telegram fullscreen init error:", e);
        }
    }, []);
}
