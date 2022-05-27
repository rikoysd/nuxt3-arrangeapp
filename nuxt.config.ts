import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildModules: ["@pinia/nuxt"],
  css: [
    "bootstrap/dist/css/bootstrap.css",
    "bootstrap-vue-3/dist/bootstrap-vue-3.css",
  ],
  modules: ["@nuxtjs/dayjs"],
  dayjs: {
    locales: ["en", "ja"],
    defaultLocale: "en",
    defaultTimeZone: "Asia/Tokyo",
    plugins: [
      "utc", // import 'dayjs/plugin/utc'
      "timezone", // import 'dayjs/plugin/timezone'
    ], // Your Day.js plugin
  },
});
