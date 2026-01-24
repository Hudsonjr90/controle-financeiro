<template>
  <div class="q-mb-md">
    <div class="q-mb-xs" style="font-size: 1.1em;">Total gastos: <strong>{{ numberToReal(store.totalExpenses) }}</strong></div>
    <div class="q-mb-xs" style="font-size: 1.1em;">Renda: <strong>{{ numberToReal(store.income) }}</strong></div>
    <div
      class="text-h6 q-mt-md"
      :class="store.remaining >= 0 ? 'text-positive' : 'text-negative'"
      style="font-size: 1.2em;"
    >
      Saldo: {{ numberToReal(store.remaining) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFinanceStore } from "@/stores/finance";
import { numberToReal } from "@/utils/functions";
const store = useFinanceStore();
</script>
