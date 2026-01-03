// https://nuxt.com/docs/api/configuration/nuxt-config
import { quasarOptions } from "./quasar-options";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', 'nuxt-quasar-ui'],
  quasar: quasarOptions,
  build: {
    transpile: ["quasar"],
  },
  css: ["@/assets/styles/quasar-custom.sass"],
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          quietDeps: true,
          silenceDeprecations: ["import"], 
        },
      },
    },
  },
})
