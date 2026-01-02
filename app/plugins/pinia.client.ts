import { useFinanceStore } from "@/stores/finance";

export default defineNuxtPlugin(() => {
   const store = useFinanceStore();
  store.load();
});