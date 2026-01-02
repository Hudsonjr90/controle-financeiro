<template>
  <div>
    <div>Total gastos: <strong>R$ {{ store.totalExpenses.toFixed(2) }}</strong></div>
    <div>Renda: <strong>R$ {{ store.income.toFixed(2) }}</strong></div>

    <div
      class="text-h6 q-mt-md"
      :class="store.remaining >= 0 ? 'text-positive' : 'text-negative'"
    >
      Saldo: R$ {{ store.remaining.toFixed(2) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFinanceStore } from "@/stores/finance";
const store = useFinanceStore();
</script>
