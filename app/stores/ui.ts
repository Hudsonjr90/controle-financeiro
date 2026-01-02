import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    dark: false,
  }),

  actions: {
    toggleDark($q: any) {
      this.dark = !this.dark;
      $q.dark.set(this.dark);
      localStorage.setItem("dark", String(this.dark));
    },

    load($q: any) {
      const saved = localStorage.getItem("dark");
      this.dark = saved === "true";
      $q.dark.set(this.dark);
    },
  },
});
