import { watch } from "vue";
import { useFinanceStore } from "@/stores/finance";

export default defineNuxtPlugin(() => {
  const store = useFinanceStore();

  store.load();

  watch(
    store.$state,
    (state) => {
      localStorage.setItem("finance", JSON.stringify(state));
    },
    { deep: true }
  );
});
