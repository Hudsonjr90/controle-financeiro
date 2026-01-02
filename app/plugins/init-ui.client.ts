import { useUIStore } from "@/stores/ui";
import { useQuasar } from "quasar";

export default defineNuxtPlugin(() => {
  const ui = useUIStore();
  const $q = useQuasar();

  ui.load($q);
});
