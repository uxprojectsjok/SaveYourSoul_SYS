import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",

  runtimeConfig: {
    public: {
      allowCreateSoul: process.env.ALLOW_CREATE_SOUL === 'true',
      allowLogin:      process.env.ALLOW_LOGIN === 'true',
    },
  },

  css: ["~/assets/css/main.css"],

  nitro: {
    preset: "static",
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ["/", "/api-docs"],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    baseURL: "/",
    buildAssetsDir: "/_nuxt/",
    head: {
      htmlAttrs: { lang: "de" },
      title: "SaveYourSoul",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0, viewport-fit=cover" },
        { name: "description", content: "Deine persönliche Identitätsschicht für KI-Systeme. Portabel. Verschlüsselt. Unter deiner Kontrolle." },
        { name: "theme-color", content: "#12101a" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "apple-mobile-web-app-title", content: "SYS" },
      ],
      link: [
        { rel: "manifest", href: "/manifest.json?v=2" },
        { rel: "icon", type: "image/x-icon", href: "/logo.ico?v=2" },
        { rel: "apple-touch-icon", sizes: "192x192", href: "/icons/icon-192.png?v=2" },
        { rel: "apple-touch-icon", sizes: "512x512", href: "/icons/icon-512.png?v=2" },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/oxanium/Oxanium-Regular.woff2", crossorigin: "anonymous" },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/oxanium/Oxanium-SemiBold.woff2", crossorigin: "anonymous" },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/noto-serif/NotoSerif-Bold.woff2", crossorigin: "anonymous" },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/inter/Inter_18pt-Regular.woff2", crossorigin: "anonymous" },
        { rel: "stylesheet", href: "/fonts/remixicon/remixicon.css" },
      ],
    },
  },
});
