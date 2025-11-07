// // vite.config.ts
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import tailwindcss from "@tailwindcss/vite";

// // ⬇️ якщо ngrok видає новий домен кожного разу - залишай ".ngrok-free.app"
// //    якщо хочеш жорстко - впиши точний домен з помилки: "2efc2decb7ec.ngrok-free.app"
// const ALLOWED_HOSTS = [ "localhost", "127.0.0.1", ".ngrok-free.app" ];
// // const ALLOWED_HOSTS = [ "localhost", "127.0.0.1", "2efc2decb7ec.ngrok-free.app" ];

// export default defineConfig({
//     plugins: [react(), tailwindcss()],
//     resolve: {
//         alias: {
//             "@": path.resolve(__dirname, "./src"),
//         },
//     },
//     server: {
//         host: true,                 // дозволяє доступ ззовні (0.0.0.0)
//         port: 5173,                 // твій dev порт
//         allowedHosts: ALLOWED_HOSTS,
//         // HMR через ngrok (часто і так працює, але ці опції інколи рятують)
//         hmr: {
//             // якщо використовуєш конкретний домен - розкоментуй і впиши його:
//             // host: "2efc2decb7ec.ngrok-free.app",
//             clientPort: 443,          // клієнт підключається по HTTPS через ngrok
//             protocol: "wss",          // захищений вебсокет через тунель
//         },
//     },
// });
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

const ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.ngrok-free.app'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const NGROK_HOST = env.NGROK_HOST || '';
  const USE_POLLING = env.CHOKIDAR_USEPOLLING === '1';

  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    server: {
      host: true,
      port: 5173,
      allowedHosts: ALLOWED_HOSTS,
      hmr: NGROK_HOST
        ? { host: NGROK_HOST, protocol: 'wss', clientPort: 443 }
        : true,
      watch: USE_POLLING ? { usePolling: true, interval: 100 } : undefined,
    },
  };
});
