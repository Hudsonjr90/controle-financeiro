<template>
  <q-input
    v-model="store.income"
    label="Renda mensal (R$)"
    type="number"
    filled
    @update:model-value="handleIncomeUpdate"
  />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useFinanceStore } from "@/stores/finance";

const store = useFinanceStore();

const handleIncomeUpdate = (value: string | number | null) => {
  const numericValue = typeof value === 'number' ? value : Number(value) || 0;
  store.setIncome(numericValue);
};

onMounted(() => {
  store.load();
});
</script>
